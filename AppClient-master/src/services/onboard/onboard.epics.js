export default ({
	actionTypes,
	actions,
	localStorage,
}) => {
	const tipIds = ['shareLink'];

	// TODO - Post to server
	const loadTips = action$ =>
		action$
			.first()
			.map(() =>
				tipIds.reduce((dict, id) => ({
					...dict,
					[id]: !(localStorage.getItem(`onboard.${id}`) === 'false'),
				}), {}),
			)
			.map(tips => actions.tipsLoaded(tips));


	const closeTip = action$ =>
		action$
			.ofType(actionTypes.TIP_CLOSE)
			.pluck('payload', 'tipId')
			.do((tipId) => {
				localStorage.setItem(`onboard.${tipId}`, false);
			})
			.filter(() => false);


	return {
		loadTips,
		closeTip,
	};
};
