export default ({
	Observable,
	combineEpics,
	url,
	selectors,
	actionTypes,
	actions,
	notificationActions,
	broadcastActions,
	broadcastActionTypes,
	broadcastSelectors,
	videoActions,
	requests,
	alerts,
	popupWindow,
	expBackoff,
	ga,
	logger,
}) => {
	const obsOf = action => Observable.of(action);

	function reqErrName(err) {
		return err.statusCode === 0 ? 'REQUEST_TIMEOUT' : 'SERVER_ERROR';
	}

	const logRestreamEvent = (actionName, platform) => () => ga.event({
		category: 'restream',
		action: actionName,
		label: platform,
	});

	const getRestreamRedirect = platform =>
		expBackoff({
			promise: () => requests.getRestreamRedirect(platform),
			retryWhen: err => err.statusCode >= 500,
			initialDelay: 200,
			maxRetries: 3,
		})
		.pluck('body', 'redirectUrl');


	// Open up a popup window to ask for permissions.
	const restreamPopupWindow = platform => action$ =>
		popupWindow({
			windowName: 'f2fRestream',
			getRedirectUrl: getRestreamRedirect(platform),
			endUrl: 'state=restream.',
		})
		.filter(href => href.indexOf('error=') === -1)
		.map(href => url.parse(href, true).query)
		.do(logRestreamEvent('restreamKeyAttempt', platform))
		.mergeMap(({ code, state }) =>
			expBackoff({
				promise: () => requests.getRestreamKey({ platform, code, state }),
				retryWhen: err => err.statusCode >= 500,
				initialDelay: 200,
				maxRetries: 3,
			})
			.pluck('body', 'key')
			.do(logRestreamEvent('restreamKeySuccess', platform))
			.map((key) => {
				if (platform === 'youtube') {
					return actions.setYoutubeKey({ key });
				}
				return null;
			})
			.filter(action => action)
			.takeUntil(action$.ofType(broadcastActionTypes.BROADCAST_LEAVE))
			.catch((err) => {
				logger.error(err);
				if (err.body.message === 'liveStreamingNotEnabled') {
					return obsOf(broadcastActions.alert({
						name: alerts.RESTREAM_ENABLE_YOUTUBE,
					}));
				}
				return obsOf(broadcastActions.alert({
					name: alerts.RESTREAM_KEY_FAILED,
					args: { platform },
				}));
			}),
		)
		.catch((err) => {
			logger.error(err);
			return obsOf(notificationActions.addMsg({ name: reqErrName(err) }));
		});


	const getYoutubeKey = (action$, store) =>
		action$
			.ofType(actionTypes.YOUTUBE_BTN_CLICK)
			.filter(() => !selectors.hasYoutubeKey(store.getState()))
			.switchMap(() => restreamPopupWindow('youtube')(action$));


	const removeYoutubeKey = (action$, store) =>
		action$
			.ofType(actionTypes.YOUTUBE_BTN_CLICK)
			.map(() => selectors.youtubeRestreamKey(store.getState()))
			.filter(key => key)
			.mergeMap(key => Observable.merge(
				Observable.of(actions.removeYoutubeKey()),
				Observable.of(videoActions.removeRestreamKey({ key })),
			));


	const startYoutubeIfLive = (action$, store) =>
		action$
			.ofType(actionTypes.YOUTUBE_SET_KEY)
			.filter(() => broadcastSelectors.isLive(store.getState()))
			.pluck('payload', 'key')
			.do(logRestreamEvent('start', 'youtube'))
			.map(key => videoActions.addRestreamKey({ key }));


	const startYoutubeWhenGoingLive = (action$, store) =>
		action$
			.ofType(broadcastActionTypes.BROADCAST_JOIN_SUCCESS)
			.switchMap(() => action$
				.ofType(broadcastActionTypes.BROADCAST_LIVE_SET)
				.pluck('payload', 'isLive')
				.filter(isLive => isLive)
				.take(1)
				.map(() => selectors.youtubeRestreamKey(store.getState()))
				.filter(key => key)
				.do(logRestreamEvent('start', 'youtube'))
				.map(key => videoActions.addRestreamKey({ key })),
			);

	return combineEpics(
		getYoutubeKey,
		removeYoutubeKey,
		startYoutubeIfLive,
		startYoutubeWhenGoingLive,
	);
};
