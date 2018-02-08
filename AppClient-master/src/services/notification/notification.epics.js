export default ({
	actionTypes,
	ga,
}) => {
	// Pull our own user data
	const logNotifications = action$ =>
		action$
			.ofType(actionTypes.ADD_MSG)
			.pluck('payload', 'name')
			.do(name => ga.event({
				category: 'notifications',
				action: name,
			}))
			.filter(() => false);


	return { logNotifications };
};
