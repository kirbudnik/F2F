module.exports = ({ _, hexColorRegex, config, logger, stripe, helpers, usersController }) => {
	const {
		MAX_PAY_BTN_TEXT_LEN,
		MAX_PAY_DESC_TEXT_LEN,
	} = config;

	const {
		isAllBools,
		hasOnlyTheseKeys,
		csrfHash,
		isNonEmptyString,
	} = helpers;


	// User will open this url in a separate window to grant f2f access to their
	// stripe account. Upon success the window will be redirected back to us with
	// a code.
	function getStripeRedirectUrl(req, res) {
		const state = `stripe.${csrfHash(req.cookies.csrfToken)}`;
		const redirectUrl = stripe.redirectUrl(state);

		return res.json({ redirectUrl });
	}


	// User has granted stripe access and now has a code. We need to send this code
	// to stripe to get the user's auth credentials
	function linkStripe(req, res) {
		const { code, state } = req.body;
		const { user } = req;

		// Verfify that the state parameter is a hash of our csrf
		if (!isNonEmptyString(code)) {
			return res.sendStatus(400);
		}
		if (state !== `stripe.${csrfHash(req.cookies.csrfToken)}`) {
			return res.sendStatus(403);
		}
		if (!user.pay.isApproved) {
			logger.log(user.username, 'attempted to link stripe before approval');
			return res.sendStatus(403);
		}

		return stripe.exchangeCodeForCredentials(code)
			.then(platformId =>
				usersController.linkStripe({
					platformId,
					user,
				})
					.then(() => {
						logger.log(user.username, 'linked their Stripe account');
						res.sendStatus(200);
					})
					.catch((err) => {
						logger.error('Stripe link account', err);
						res.sendStatus(500);
					}),
			)
			.catch((err) => {
				logger.error('Stripe get credentials', err);
				res.sendStatus(500);
			});
	}


	function unlinkStripe(req, res) {
		const { user } = req;

		if (!(user.stripe instanceof Object) || !user.stripe.platformId) {
			// User account isn't linked now. Return success
			res.sendStatus(200);
			return;
		}

		const unlink = () =>
			usersController.unlinkStripe({ user: req.user })
				.then(() => {
					logger.log(user.username, 'revoked their Stripe account');
					res.sendStatus(200);
				})
				.catch((err) => {
					logger.error('Stripe unlink account', err);
					res.sendStatus(500);
				});

		stripe.revokeStripeAccess(user.stripe.platformId)
			.then(() => unlink())
			.catch((err) => {
				logger.error('Stripe revoke access', err);
				if (_.get(err, 'error.error') === 'invalid_client') {
					// Stripe will return this if this client is not connected.
					// Treat as a successful unlink.
					unlink();
				} else {
					res.sendStatus(500);
				}
			});
	}


	function appliedForPay(req, res) {
		const { user } = req;

		if (user.pay.isApproved || user.pay.hasApplied) {
			return res.sendStatus(200);
		}

		return usersController.appliedForPay({ user })
			.then(() => {
				res.sendStatus(200);
			})
			.catch((err) => {
				logger.error('Applied to pay', err);
				res.sendStatus(500);
			});
	}


	function getPaySettings(req, res) {
		res.json({ pay: req.user.pay });
	}


	function togglePaySettings(req, res) {
		const { user } = req;
		const {
			btnColor,
			btnText,
			descriptionText,
			presetAmounts,
			isCustomAmountOn,
			btnLocations,
		} = req.body;

		const settings = {};

		if ('btnColor' in req.body) {
			if (!hexColorRegex({ strict: true }).test(btnColor)) {
				return res.sendStatus(400);
			}
			settings.btnColor = btnColor;
		}

		if ('btnText' in req.body) {
			if (typeof btnText !== 'string' || btnText.length > MAX_PAY_BTN_TEXT_LEN) {
				return res.sendStatus(400);
			}
			settings.btnText = btnText;
		}

		if ('descriptionText' in req.body) {
			if (
					typeof descriptionText !== 'string' ||
					descriptionText.length > MAX_PAY_DESC_TEXT_LEN) {
				return res.sendStatus(400);
			}

			settings.descriptionText = descriptionText;
		}

		if ('presetAmounts' in req.body) {
			if (
					!Array.isArray(presetAmounts) ||
					presetAmounts.length !== 3 ||
					presetAmounts.filter(a => Number.isInteger(a) && a >= 0).length !== 3) {
				return res.sendStatus(400);
			}

			settings.presetAmounts = presetAmounts;
		}

		if ('isCustomAmountOn' in req.body) {
			if (typeof isCustomAmountOn !== 'boolean') {
				return res.sendStatus(400);
			}

			settings.isCustomAmountOn = isCustomAmountOn;
		}

		if ('btnLocations' in req.body) {
			if (
					!(btnLocations instanceof Object) ||
					!hasOnlyTheseKeys(btnLocations, ['channel', 'profile']) ||
					!isAllBools(btnLocations)) {
				return res.sendStatus(400);
			}

			settings.btnLocations = {
				...user.pay.btnLocations,
				...btnLocations,
			};
		}

		return usersController.togglePaySettings({ user, settings })
			.then(() => res.json({}))
			.catch((err) => {
				logger.error('Toggle pay settings', err);
				return res.sendStatus(500);
			});
	}


	return {
		getStripeRedirectUrl,
		linkStripe,
		unlinkStripe,
		appliedForPay,
		getPaySettings,
		togglePaySettings,
	};
};
