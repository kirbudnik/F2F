export default ({
	Observable,
	combineEpics,
	requests,
	expBackoff,
	actions,
	actionTypes,
	// selectors,
}) => {
	const obsOf = action => Observable.of(action);

	const loadPage = action$ =>
		action$
			.ofType(actionTypes.LOAD_PAGE)
			.pluck('payload')
			.switchMap(payload =>
				expBackoff({
					promise: () => requests.getPage(payload),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 5,
				})
				.takeUntil(action$.ofType(actionTypes.LOAD_PAGE))
				.pluck('body')
				.map(body => actions.loadPageSuccess({ ...body }))
				.catch((err) => {
					if (err.statusCode === 404 || err.statusCode === 400) {
						return obsOf(actions.loadPage404());
					}
					return obsOf(actions.loadPageFail());
				}),
			);

	return combineEpics(
		loadPage,
	);
};
