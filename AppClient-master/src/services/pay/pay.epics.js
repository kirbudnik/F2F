export default ({
	Observable,
	ga,
	requests,
	expBackoff,
	actions,
	actionTypes,
	notificationActions,
}) => {
	const stop = () => false;
	const obsOf = action => Observable.of(action);
	const multipleEmits = (...emits) => Observable.merge(...emits.map(obsOf));

	function reqErrName(err) {
		return err.statusCode === 0 ? 'REQUEST_TIMEOUT' : 'SERVER_ERROR';
	}

	const logPayEvent = actionName => ({ amount }) => ga.event({
		category: 'pay',
		action: actionName,
		label: 'usd',
		value: amount,
	});


	const logStripeModalOpens = action$ =>
		action$
			.ofType(actionTypes.STRIPE_MODAL_OPENED)
			.pluck('payload')
			.do(logPayEvent('stripeModalOpened'))
			.filter(stop);


	const logStripeModalCloses = action$ =>
		action$
			.ofType(actionTypes.STRIPE_MODAL_CLOSED)
			.pluck('payload')
			.do(logPayEvent('stripeModalClosed'))
			.filter(stop);


	const paymentFailed = args => multipleEmits(
		actions.payFailed(),
		notificationActions.addMsg(args),
	);

	// Amount should be a positive integer in smallest currency unit (cents in USD)
	const payWithStripe = action$ =>
		action$
			.ofType(actionTypes.STRIPE_PAY)
			.pluck('payload')
			.do(logPayEvent('stripePayAttempt'))
			.mergeMap(args =>
				expBackoff({
					promise: () => requests.payWithStripe(args),
					// TODO - We can add retries after adding a unique id to each payment
					// on the client side that ensures we don't charge the client twice
					// under any circumstances.
					maxRetries: 0,
				})
				.do(() => logPayEvent('stripePaySuccess')(args))
				.map(() => actions.paySuccess())
				.catch((err) => {
					if (err.statusCode === 402 && err.body.message) {
						return paymentFailed({
							name: 'PAY_CARD_ERROR',
							args: { message: err.body.message },
						});
					} else if (err.statusCode === 409) {
						return paymentFailed({ name: 'PAY_NOT_SET_UP' });
					} else if (err.statusCode >= 500) {
						return paymentFailed({ name: 'PAY_FAILED' });
					}
					// We likely messed up if this is a 400/404
					return paymentFailed({ name: reqErrName(err) });
				}),
			);


	return {
		logStripeModalOpens,
		logStripeModalCloses,
		payWithStripe,
	};
};
