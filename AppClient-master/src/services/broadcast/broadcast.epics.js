const HOST_KEEP_ALIVE_INTERVAL = 9000;

export default ({
	Observable,
	actions,
	actionTypes,
	selectors,
	notificationActions,
	pageActions,
	userSelectors,
	userActionTypes,
	videoActions,
	videoActionTypes,
	videoLayouts,
	videoRoles,
	appMessageTypes,
	helpers,
	requests,
	alerts,
	history,
	chrome,
	ga,
	logger,
	expBackoff,
	DEBUG,
}) => {
	const {
		isUnlistedBroadcastId,
		channelFromBroadcastId,
		nameFromBroadcastId,
		layoutHasScreen,
		layoutHasGuests,
	} = helpers;

	const stop = () => false;
	const getBroadcastId = store => () => selectors.broadcastId(store.getState());
	const ensureHost = store => () => selectors.isHost(store.getState());
	const isValidLayout = layout => Object.values(videoLayouts).includes(layout);
	const isBool = val => typeof val === 'boolean';

	const isAllBools = dict =>
		Object.values(dict).length === Object.values(dict).filter(isBool).length;

	const filterKeys = keys => (dict) => {
		const newDict = {};

		Object
			.keys(dict)
			.filter(key => keys.includes(key))
			.forEach((key) => {
				newDict[key] = dict[key];
			});

		return newDict;
	};

	const obsOf = action => Observable.of(action);

	const multipleEmits = (...emits) =>
		Observable.merge(...emits.map(obsOf));

	function reqErrName(err) {
		switch (err.statusCode) {
			case 0:
				return 'REQUEST_TIMEOUT';
			case 401:
				return 'LOGIN_REQUIRED';
			default:
				return 'SERVER_ERROR';
		}
	}


	const endBroadcast = (action$, store) =>
		action$
			.ofType(actionTypes.BROADCAST_END)
			.map(getBroadcastId(store))
			.filter(id => id)
			.switchMap(broadcastId =>
				expBackoff({
					promise: () => requests.endBroadcast(broadcastId),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 3,
				})
				.do(() => ga.event({
					category: 'broadcast',
					action: 'broadcastEnd',
					label: isUnlistedBroadcastId(broadcastId) ? 'unlisted' : 'public',
				}))
				.map(() => actions.leaveBroadcast())
				.catch((err) => {
					logger.error(err);
					return obsOf(notificationActions.addMsg({ name: reqErrName(err) }));
				}),
			);


	const getBroadcast = action$ =>
		action$
			.ofType(actionTypes.BROADCAST_GET)
			.pluck('payload', 'broadcastId')
			.switchMap(broadcastId =>
				expBackoff({
					promise: () => requests.getBroadcast(broadcastId),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 5,
				})
				.pluck('body')
				.mergeMap(({ isLive, layout }) => multipleEmits(
					actions.setLayout({ layout }),
					actions.setIsLive({ isLive }),
				))
				.takeUntil(action$.ofType(actionTypes.BROADCAST_LEAVE))
				.catch((err) => {
					logger.error(err);
					// Fail silently since this is just a request to load
					// the most recent broadcast data
					return Observable.empty();
				}),
			);

	const startPublicBroadcast = action$ =>
		action$
			.ofType(actionTypes.BROADCAST_START_PUBLIC)
			.pluck('payload', 'channelName')
			.switchMap(channelName =>
				expBackoff({
					promise: () => requests.createBroadcast({ channelName }),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 3,
				})
				.pluck('body', 'id')
				.do(() => ga.event({
					category: 'broadcast',
					action: 'broadcastStart',
					label: 'public',
				}))
				.map(broadcastId => actions.joinBroadcast({ broadcastId }))
				.catch((err) => {
					logger.error(err);
					if (err.statusCode >= 500) {
						return obsOf(notificationActions.addMsg({ name: 'START_BROADCAST_FAILED' }));
					}
					return obsOf(notificationActions.addMsg({ name: reqErrName(err) }));
				}),
			);

	// A random name will be generate on the server if the request is blank
	const startUnlistedBroadcast = action$ =>
		action$
			.ofType(actionTypes.BROADCAST_START_UNLISTED)
			.pluck('payload', 'name')
			.switchMap(broadcastName =>
				expBackoff({
					promise: () => requests.createBroadcast({ broadcastName, isUnlisted: true }),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 3,
				})
				.pluck('body')
				.do(() => ga.event({
					category: 'broadcast',
					action: 'broadcastStart',
					label: 'unlisted',
				}))
				.filter(({ id, hostUsername }) => {
					// If the user typed something then we should put it in the url
					// to preserve text casing. Otherwise just grab it from broadcast id.
					if (broadcastName) {
						history.push(`/${hostUsername}/-${broadcastName}`);
					} else {
						history.push(`/${hostUsername}/${channelFromBroadcastId(id)}`);
					}
					return false;
				})
				.catch((err) => {
					logger.error(err);
					if (err.statusCode === 400) {
						// Name is validated locally because submission so this will only occur
						// if user entered an offensive name that the server rejected
						return Observable.empty();
					}
					if (err.statusCode >= 500) {
						return obsOf(notificationActions.addMsg({ name: 'START_BROADCAST_FAILED' }));
					}
					return obsOf(notificationActions.addMsg({ name: reqErrName(err) }));
				}),
			);

	const leaveVideoRoom = action$ =>
		action$
			.ofType(actionTypes.BROADCAST_LEAVE)
			.map(() => videoActions.leaveRoom());

	const waitForAuth = (action$, store, done) => Observable.if(
		() => userSelectors.isAuth(store.getState()) !== null,
		done,
		action$
			.filter(({ type }) =>
				type === userActionTypes.AUTH_SUCCESS ||
				type === userActionTypes.AUTH_FAIL,
			)
			.first()
			.switchMap(() => done),
	);

	// Continually try to join on an interval. Broadcast may be created at any time.
	const joinBroadcast = (action$, store) =>
		action$
			.ofType(actionTypes.BROADCAST_JOIN)
			.pluck('payload', 'broadcastId')
			.switchMap((broadcastId) => {
				if (!selectors.hasVideoLibLoaded(store.getState())) {
					return obsOf(notificationActions.addMsg({ name: 'SERVER_ERROR' }));
				}
				if (!selectors.isWebrtcEnabled(store.getState())) {
					// Redirect to page that explains what devices/browsers are supported.
					// Don't redirect on dev. Helpful to see ui on unsupported devices.
					if (DEBUG) {
						logger.log('Webtc not supported. Production build would redirect to https://blog.f2f.live/supported-operating-systems-and-browsers/');
					} else {
						window.location.replace('https://blog.f2f.live/supported-operating-systems-and-browsers/');
						return Observable.empty();
					}
				}
				return waitForAuth(action$, store, Observable
					.interval(10000)
					.startWith(0)
					.switchMap(() =>
						expBackoff({
							// Join broadcast will simply return no data if broadcast does not exist
							promise: () => requests.joinBroadcast(broadcastId),
							retryWhen: err => err.statusCode >= 500,
							initialDelay: 200,
							maxRetries: 5,
						})
						.pluck('body')
						.switchMap((body) => {
							if (body.token) {
								return obsOf(actions.joinBroadcastSuccess({
									...body,
									broadcastId,
									broadcastName: nameFromBroadcastId(broadcastId),
								}));
							}
							return obsOf(actions.joinBroadcast404({ broadcastId }));
						})
						.catch((err) => {
							// This endpoint only throws an error if something goes wrong.
							logger.error(err);
							return obsOf(actions.joinBroadcastFailed({ broadcastId }));
						}),
					)
					.takeUntil(action$.ofType(actionTypes.BROADCAST_JOIN_SUCCESS))
					.takeUntil(action$.ofType(actionTypes.BROADCAST_LEAVE)));
			});


	// Join the video room once we have a video token
	const joinVideoRoom = (action$, store) =>
		action$
			.ofType(actionTypes.BROADCAST_JOIN_SUCCESS)
			.filter(() => selectors.isWebrtcEnabled(store.getState()))
			.pluck('payload')
			.map(({ token, videoRoomId }) =>
				videoActions.joinRoom({ token, roomId: videoRoomId }));


	// const noWebrtcAlert = (action$, store) =>
	// 	action$
	// 		.ofType(actionTypes.BROADCAST_JOIN_SUCCESS)
	// 		.filter(() => !selectors.isWebrtcEnabled(store.getState()))
	// 		.map(() => {
	// 			const state = store.getState();

	// 			if (!selectors.hasVideoLibLoaded(state)) {
	// 				return notificationActions.addMsg({ name: 'SERVER_ERROR' });
	// 			}
	// 			// Remove this if we begin supporting ios in the browser
	// 			if (selectors.isIOS(state)) {
	// 				return actions.alert({ name: alerts.WEBRTC_NO_IOS });
	// 			}
	// 			// Uncomment if we begin supporting ios in the browser
	// 			// if (selectors.isOldIOS(state)) {
	// 			// 	return actions.alert({ name: alerts.WEBRTC_UPDATE_IOS });
	// 			// }
	// 			if (!selectors.isWebrtcBrowser(state)) {
	// 				return actions.alert({ name: alerts.WEBRTC_UNSUPPORTED_BROWSER });
	// 			}
	// 			if (selectors.isWebrtcBrowserUpdateRequired(state)) {
	// 				return actions.alert({ name: alerts.WEBRTC_UPDATE_BROWSER });
	// 			}
	// 			return actions.alert({ name: alerts.WEBRTC_UNSUPPORTED });
	// 		});


	const handleVideoRoom404 = (action$, store) =>
		action$
			.ofType(videoActionTypes.ROOM_JOIN_FAILURE)
			.pluck('payload', 'err', 'name')
			.filter(name => name === 'notFound')
			.map(() => actions.alert({
				name: alerts.ROOM_NOT_FOUND,
				args: { isHost: selectors.isHost(store.getState()) },
			}));


	// Something went wrong joining a broadcast. User very likely came to see the
	// the broadcast and not just the page so it is appropriate to put up an error page
	const renderErrorPage = action$ =>
		action$
			.ofType(actionTypes.BROADCAST_JOIN_FAILURE)
			.map(() => pageActions.loadPageFail());


	// Load state after joining the video room
	const loadInitialBroadcastState = (action$, store) =>
		action$
			.ofType(videoActionTypes.ROOM_JOIN_SUCCESS)
			.map(getBroadcastId(store))
			.map(broadcastId => actions.getBroadcast({ broadcastId }));


	const addRemoteHandListener = (action$, store) =>
		action$
			.ofType(videoActionTypes.ROOM_JOIN_SUCCESS)
			.filter(() => selectors.isHost(store.getState()))
			.map(() => videoActions.listenToRemoteHands());


	// The host needs to send keep-alives. Send one on load then on an interval.
	const hostSendKeepAlives = (action$, store) =>
		action$
			.ofType(videoActionTypes.ROOM_JOIN_SUCCESS)
			.filter(ensureHost(store))
			.map(getBroadcastId(store))
			.filter(id => id)
			.switchMap(broadcastId => Observable
				.interval(HOST_KEEP_ALIVE_INTERVAL)
				.startWith(0)
				.takeUntil(action$.ofType(actionTypes.BROADCAST_LEAVE))
				.switchMap(() =>
					expBackoff({
						promise: () => requests.keepAlive(broadcastId),
						retryWhen: err => err.statusCode >= 500 || err.statusCode === 0,
						initialDelay: 2000,
						maxDelay: 2000,
						maxRetries: 2,
					})
					.filter(stop)
					.catch((err) => {
						logger.error(err);
						// Fail silently
						return Observable.empty();
					}),
				),
			);


	const goLive = (action$, store) =>
		action$
			.ofType(actionTypes.BROADCAST_LIVE_CLICK)
			.map(getBroadcastId(store))
			.filter(id => id)
			.switchMap(broadcastId =>
				expBackoff({
					promise: () => requests.goLive(broadcastId),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 3,
				})
				.map(() => actions.setIsLive({ isLive: true }))
				.takeUntil(action$.ofType(actionTypes.BROADCAST_LEAVE))
				.catch((err) => {
					logger.log(err);
					return obsOf(notificationActions.addMsg({ name: reqErrName(err) }));
				}),
			);


	const handleSettingsClick = (action$, store) =>
		action$
			.ofType(actionTypes.SETTINGS_CLICKED)
			.pluck('payload')
			.mergeMap(settings =>
				expBackoff({
					promise: () => requests.changeSettings(
						selectors.broadcastId(store.getState()),
						settings,
					),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 3,
				})
				.map(() => actions.toggleSettings(settings))
				.catch((err) => {
					logger.log(err);
					return obsOf(notificationActions.addMsg({ name: reqErrName(err) }));
				}),
			);


	const toggleViewerCountListener = (action$, store) =>
		action$
			.filter(action =>
				action.type === videoActionTypes.ROOM_JOIN_SUCCESS ||
				(action.type === actionTypes.SETTINGS_TOGGLE &&
					'isViewerCountOn' in action.payload),
			)
			.map(() => store.getState())
			.switchMap(state => Observable.if(
				() => selectors.isHost(state) || selectors.isViewerCountOn(state),
				obsOf(videoActions.listenToViewerCount()),
				obsOf(videoActions.muteViewerCount()),
			));


	const onVideoAppMessage = msgType => action$ =>
		action$
			.ofType(videoActionTypes.APP_MESSAGE)
			.pluck('payload')
			.filter(payload => payload.type === msgType);


	const listenForLive = action$ =>
		onVideoAppMessage(appMessageTypes.LIVE)(action$)
			.map(() => actions.setIsLive({ isLive: true }));


	const listenForDead = action$ =>
		onVideoAppMessage(appMessageTypes.DEAD)(action$)
			.map(() => actions.leaveBroadcast());


	const listenForLayoutChanges = action$ =>
		onVideoAppMessage(appMessageTypes.LAYOUT)(action$)
			.pluck('data', 'layout')
			.filter(layout => isValidLayout(layout))
			.map(layout => actions.setLayout({ layout }));


	const broadcastSettingsKeys = ['isViewerCountOn', 'isAutoJoinOn', 'isQueueSoundOn'];

	const listenForSettingsChanges = action$ =>
		onVideoAppMessage(appMessageTypes.SETTINGS)(action$)
			.pluck('data')
			.filter(filterKeys(broadcastSettingsKeys))
			.filter(isAllBools)
			.filter(args => Object.keys(args).length > 0)
			.map(args => actions.toggleSettings(args));


	const setLayout = ({ broadcastId, layout, shouldThrow }) =>
		expBackoff({
			promise: () => requests.setLayout(broadcastId, layout),
			retryWhen: err => err.statusCode >= 500,
			initialDelay: 200,
			maxRetries: 3,
		})
		.map(() => actions.setLayout({ layout }))
		.catch((err) => {
			logger.log(err);
			if (shouldThrow) {
				return obsOf(notificationActions.addMsg({ name: reqErrName(err) }));
			}
			return Observable.empty();
		});

	const layoutClickHandler = (action$, store) =>
		action$
			.ofType(actionTypes.LAYOUT_CLICK)
			.pluck('payload', 'layout')
			.filter(layout => (
				!layoutHasScreen(layout) ||
				selectors.isAnyoneScreenSharing(store.getState())
			))
			.map(layout => ({
				layout,
				broadcastId: selectors.broadcastId(store.getState()),
				shouldThrow: true,
			}))
			.switchMap(setLayout);


	const changeLayoutOnScreenStart = (action$, store) =>
		action$
			.ofType(videoActionTypes.STREAM_STARTED)
			.pluck('payload')
			.filter(payload => payload.isScreen && !payload.isTrial)
			.filter(() => selectors.isHost(store.getState()))
			.map(() => {
				const state = store.getState();
				return {
					layout: selectors.videoLayout(state),
					layoutOnDeck: selectors.videoLayoutOnDeck(state),
					broadcastId: selectors.broadcastId(state),
				};
			})
			.filter(args => !layoutHasScreen(args.layout))
			.map((args) => {
				let layout = videoLayouts.SCREEN;

				if (layoutHasScreen(args.layoutOnDeck)) {
					layout = args.layoutOnDeck;
				}
				return {
					layout,
					broadcastId: args.broadcastId,
				};
			})
			.mergeMap(setLayout);


	const changeLayoutOnScreenStop = (action$, store) =>
		action$
			.ofType(videoActionTypes.STREAM_ENDED)
			.pluck('payload')
			.filter(payload => payload.isScreen && !payload.isTrial)
			.filter(() => selectors.isHost(store.getState()))
			.map(() => selectors.videoLayout(store.getState()))
			.filter(layout => layoutHasScreen(layout))
			.map(() => ({
				layout: videoLayouts.HOST,
				broadcastId: selectors.broadcastId(store.getState()),
			}))
			.mergeMap(setLayout);


	// TODO - May want to adjust layout when host camera starts as well
	const changeLayoutWhenGuestJoins = (action$, store) =>
		action$
			.ofType(videoActionTypes.STREAM_STARTED)
			.filter(() => selectors.isHost(store.getState()))
			.pluck('payload', 'role')
			.filter(role => role !== videoRoles.MODERATOR)
			.map(() => selectors.videoLayout(store.getState()))
			.filter(layout => !layoutHasGuests(layout))
			.map(curLayout => ({
				layout: curLayout === videoLayouts.PRESENTATION
					? videoLayouts.SCREEN
					: videoLayouts.HOST,
				broadcastId: selectors.broadcastId(store.getState()),
			}))
			.mergeMap(setLayout);


	let webstoreInstall;

	if (typeof chrome !== 'undefined') {
		webstoreInstall = callback =>
			chrome.webstore.install(
				document.getElementById('chrome-screen-extension').href,
				() => callback(null),
				err => callback(err),
			);
	} else {
		webstoreInstall = callback => callback('Not chrome');
	}


	const downloadExtension = action$ =>
		action$
			.ofType(actionTypes.EXTENSION_DOWNLOAD)
			.mergeMap(() => Observable
				.bindNodeCallback(webstoreInstall)()
				.mergeMap(() => multipleEmits(
					actions.alert({ name: alerts.EXTENSION_DOWNLOAD_SUCCESS }),
					actions.closeAlert({ name: alerts.SCREEN_NO_EXTENSION }),
				))
				.catch(() => multipleEmits(
					actions.alert({ name: alerts.EXTENSION_DOWNLOAD_FAILED }),
					actions.closeAlert({ name: alerts.SCREEN_NO_EXTENSION }),
				)),
			);


	const logAudienceMinutes = action$ =>
		action$
			.ofType(videoActionTypes.ROOM_JOIN_SUCCESS)
			.mergeMap(() => Observable
				.interval(60 * 1000)
				.startWith(0)
				.do(() => ga.event({
					category: 'broadcast',
					action: 'audienceMinute',
					nonInteraction: true,
				}))
				.filter(stop)
				.takeUntil(action$.ofType(actionTypes.BROADCAST_LEAVE)),
			);


	const logAlerts = action$ =>
		action$
			.ofType(actionTypes.ALERTS_OPEN)
			.pluck('payload', 'name')
			.do(name => ga.event({
				category: 'broadcast',
				action: 'alert',
				label: name,
			}))
			.filter(stop);


	const alertOnVideoErrors = action$ =>
		action$
			.ofType(videoActionTypes.ERROR)
			.pluck('payload', 'name')
			.filter(name => Object.values(alerts).includes(name))
			.map(name => actions.alert({ name }));

	return {
		endBroadcast,
		getBroadcast,
		startPublicBroadcast,
		startUnlistedBroadcast,
		leaveVideoRoom,
		joinBroadcast,
		joinVideoRoom,
		// noWebrtcAlert,
		handleVideoRoom404,
		renderErrorPage,
		addRemoteHandListener,
		toggleViewerCountListener,
		listenForSettingsChanges,
		loadInitialBroadcastState,
		hostSendKeepAlives,
		goLive,
		handleSettingsClick,
		listenForLive,
		listenForDead,
		listenForLayoutChanges,
		layoutClickHandler,
		changeLayoutOnScreenStart,
		changeLayoutOnScreenStop,
		changeLayoutWhenGuestJoins,
		downloadExtension,
		logAudienceMinutes,
		logAlerts,
		alertOnVideoErrors,
	};
};
