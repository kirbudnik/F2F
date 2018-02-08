module.exports = ({ express, usersMiddleware, controller }) => {
	const {
		payWithStripe,
		getTransactions,
	} = controller;

	const { hasValidCookies, isAuth } = usersMiddleware;
	const router = express.Router();

	router
		.use(hasValidCookies)
		.post('/stripe', payWithStripe)
		.use(isAuth)
		.get('/', getTransactions);


	return router;
};
