export default ({
	Observable,
	requests,
	logger,
	ga,
	expBackoff,
	actions,
	actionTypes,
	selectors,
	broadcastActionTypes,
}) => {
	const now = () => Math.floor(new Date() / 1000);
	const obsOf = action => Observable.of(action);
	const stop = () => false;

	const loadAttempt = (action$, store) =>
		action$
			.ofType(actionTypes.LOAD_ATTEMPT)
			.map(() => selectors.loadedAt(store.getState()))
			// TODO - Use loadedAt time to determine if we should pull updated data.
			// Right now we will just load once and leave it until page refresh.
			.filter(loadedAt => !loadedAt)
			.map(() => actions.load());

	const load = action$ =>
		action$
			.ofType(actionTypes.LOAD)
			.switchMap(() =>
				expBackoff({
					promise: () => requests.load(),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 5,
				})
				.pluck('body', 'channels')
				.map(channels => actions.loadSuccess({
					channels,
					loadedAt: now(),
				}))
				.catch((err) => {
					logger.error(err);
					return obsOf(actions.loadFail());
				}),
			);

	const logToggles = (action$, store) =>
		action$
			.ofType(actionTypes.TOGGLE_DISCOVER)
			.map(() => selectors.isOpen(store.getState()))
			.do(isOpen => ga.event({
				category: 'discover',
				action: isOpen ? 'discoverOpened' : 'discoverClosed',
			}))
			.filter(stop);

	const logClicks = action$ =>
		action$
			.ofType(actionTypes.CHANNEL_CLICK)
			.do(() => ga.event({
				category: 'discover',
				action: 'discoverChannelClick',
			}))
			.filter(stop);

	// Listen for successful join followed by a leave. Don't just listen for leave
	// events as they happen often
	const openAfterBroadcasts = action$ =>
		action$
			.ofType(broadcastActionTypes.BROADCAST_JOIN_SUCCESS)
			.switchMap(() => action$
				.ofType(broadcastActionTypes.BROADCAST_LEAVE)
				.first()
				.map(() => actions.toggleDiscover({ isOpen: true })),
			);


	return {
		loadAttempt,
		load,
		logToggles,
		logClicks,
		openAfterBroadcasts,
	};
};
