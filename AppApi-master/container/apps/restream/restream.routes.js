module.exports = ({ express, usersMiddleware, controller }) => {
	const { getRedirectUrl, getRestreamKey } = controller;
	const { hasValidCookies, isAuth } = usersMiddleware;
	const router = express.Router();

	router
		.use(hasValidCookies)
		.get('/:platform', isAuth, getRedirectUrl)
		.post('/:platform', isAuth, getRestreamKey);

	return router;
};
