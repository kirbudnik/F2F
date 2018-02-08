module.exports = ({
	config,
	logger,
	stripe,
	helpers,
	model,
	broadcastsController,
	usersController,
}) => {
	const {
		MIN_PAY_AMOUNT,
		MAX_PAY_AMOUNT,
	} = config;

	const {
		wrap,
		isNonEmptyString,
	} = helpers;


	async function payWithStripe(req, res) {
		let err;
		let receiver;
		let charge;
		const { username, amount, token, broadcastId } = req.body;

		logger.log('Payment attempt', (amount / 100).toFixed(2), 'to', username);

		if (
				!isNonEmptyString(username) ||
				typeof amount !== 'number' ||
				amount < MIN_PAY_AMOUNT ||
				amount > MAX_PAY_AMOUNT ||
				!(token instanceof Object) ||
				typeof token.email !== 'string') {
			// Invalid arguments
			return res.sendStatus(400);
		}

		[err, receiver] = await wrap(usersController.findByUsername({ username }));
		if (err) {
			logger.error('Find by username', err);
			return res.sendStatus(500);
		}
		if (!receiver) {
			return res.sendStatus(404);
		}
		if (
				!receiver.pay.isApproved ||
				!(receiver.stripe instanceof Object) ||
				!receiver.stripe.platformId) {
			logger.log('Payment attempt to', username, 'who is not approved/signed up');
			return res.sendStatus(409);
		}

		[err, charge] = await wrap(stripe.createCharge({
			amount,
			token,
			stripeUserId: receiver.stripe.platformId,
			currency: 'usd',
			application_fee: Math.floor(amount * 0.10),
			description: `F2F payment to ${username}`,
			statement_descriptor: 'F2F PAY',
			metadata: {
				username,
				receiver: String(receiver._id),
			},
		}));
		if (err) {
			// Use .log here so we can see the entire message
			logger.log('Stripe charge', err);
			if (err.type === 'StripeCardError') {
				return res.status(402).json({ message: err.message, code: err.code });
			}
			return res.sendStatus(502);
		}

		const payment = {
			amount,
			platform: 'stripe',
			currency: 'usd',
			source: 'card',
			chargeId: charge.id,
			destination: charge.destination,
			receiver: receiver._id,
			senderEmail: token.email,
			...(req.isAuth && { sender: req.user._id }),
			...(req.isAuth && { senderUsername: req.user.username }),
		};

		[err] = await wrap(model.save(payment));
		if (err) {
			logger.error('Insert payment', err);
			// FIXME - Should keep trying to insert it. Or, ideally, use something
			// like kafka or rabbit for these kinds of insertions so we are sure the
			// insertion will get done
		}

		// Assynchronously inform broadcaster in real time
		if (broadcastId) {
			broadcastsController.payNotification({
				broadcastId,
				amount,
				currency: 'usd',
				username: req.user.username,
			});
		}

		logger.log('F2F PAY Success:', (amount / 100).toFixed(2), 'to', username);
		return res.sendStatus(200);
	}


	function getTransactions(req, res) {
		model.findByReceiver(req.user._id)
			.then(payments => payments.map(p => model.publicData(p)))
			.then(payments => res.json({ payments }))
			.catch((err) => {
				logger.error('Get transactions', err);
				res.sendStatus(500);
			});
	}


	return {
		payWithStripe,
		getTransactions,
	};
};
