module.exports = ({ express, usersMiddleware, controller }) => {
	const {
		getStripeRedirectUrl,
		linkStripe,
		unlinkStripe,
		appliedForPay,
		getPaySettings,
		togglePaySettings,
	} = controller;

	const { hasValidCookies, isAuth } = usersMiddleware;
	const router = express.Router();

	router
		.use(hasValidCookies, isAuth)
		.get('/pay', getPaySettings)
		.post('/pay', togglePaySettings)
		.get('/pay/stripe', getStripeRedirectUrl)
		.post('/pay/stripe', linkStripe)
		.delete('/pay/stripe', unlinkStripe)
		.post('/pay/applied', appliedForPay);


	return router;
};
