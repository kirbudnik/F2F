export default ({
	Observable,
	combineEpics,
	localStorage,
	ga,
	logger,
	requests,
	expBackoff,
	alerts,
	userTypes,
	actions,
	actionTypes,
	selectors,
	userActions,
	userActionTypes,
	userSelectors,
	broadcastActions,
	broadcastActionTypes,
	broadcastSelectors,
	publishActions,
	publishSelectors,
	videoActions,
	videoActionTypes,
}) => {
	// Parse a json string and return a dictionary
	function parseJsonDict(json) {
		try {
			const dict = JSON.parse(json);

			return dict instanceof Object ? dict : {};
		} catch (err) {
			return {};
		}
	}

	function isBase64(str) {
		try {
			return (
				typeof str === 'string' &&
				window.btoa(window.atob(str)) === str
			);
		} catch (err) {
			return false;
		}
	}

	const isBase64Img = str => (
		typeof str === 'string' &&
		str.indexOf('data:image/png;base64,') === 0 &&
		isBase64(str.replace('data:image/png;base64,', ''))
	);

	const obsOf = action => Observable.of(action);

	const multipleEmits = (...emits) =>
		Observable.merge(...emits.map(obsOf));

	const closeModalIfCaptureFails = action$ =>
		action$
			.ofType(videoActionTypes.TRIAL_PUBLISH_FAILED)
			.map(() => actions.toggleJoinModal({ isOpen: false }));


	const unpubTrialWhenModalCloses = (action$, store) =>
		action$
			.ofType(actionTypes.JOIN_MODAL_TOGGLE)
			.pluck('payload', 'isOpen')
			.filter(isOpen => !isOpen)
			.map(() => publishSelectors.trialStreamId(store.getState()))
			.filter(id => id)
			.map(id => videoActions.unpublish({ id }));


	const unpubTrialIfModalClosed = (action$, store) =>
		action$
			.ofType(videoActionTypes.STREAM_STARTED)
			.pluck('payload')
			.filter(stream => (
				stream.isPub &&
				stream.isTrial &&
				!selectors.isJoinModalOpen(store.getState())
			))
			.map(({ id }) => videoActions.unpublish({ id }));


	const loginToJoinQueue = (action$, store) =>
		action$
			.ofType(actionTypes.JOIN_MODAL_TOGGLE)
			.pluck('payload', 'isOpen')
			.filter(isOpen => isOpen)
			.filter(() => !userSelectors.isAuth(store.getState()))
			.do(() => localStorage.setItem(
				'openJoinModal',
				broadcastSelectors.broadcastId(store.getState()),
			))
			.mergeMap(() => multipleEmits(
				userActions.toggleLoginModal({ isOpen: true }),
				actions.toggleJoinModal({ isOpen: false }),
			));

	const clickJoinAfterLogin = (action$, store) =>
		action$
			.ofType(videoActionTypes.ROOM_JOIN_SUCCESS)
			.map(() => {
				const savedBroadcastId = localStorage.getItem('openJoinModal');
				localStorage.removeItem('openJoinModal');
				return savedBroadcastId;
			})
			.filter(id => id && id === broadcastSelectors.broadcastId(store.getState()))
			.filter(() =>
				userSelectors.isAuth(store.getState()) &&
				!broadcastSelectors.isHost(store.getState()),
			)
			.map(() => actions.toggleJoinModal({ isOpen: true }));


	const autoJoin = (action$, store) =>
		action$
			.ofType(videoActionTypes.ROOM_JOIN_SUCCESS)
			.filter(() =>
				broadcastSelectors.isAutoJoinOn(store.getState()) &&
				!broadcastSelectors.isHost(store.getState()),
			)
			.map(() => actions.toggleJoinModal({ isOpen: true }));


	const clearStorageWhenLoginModalCloses = action$ =>
		action$
			.ofType(userActionTypes.LOGIN_MODAL_TOGGLE)
			.pluck('payload', 'isOpen')
			.filter(isOpen => !isOpen)
			.do(() => localStorage.removeItem('openJoinModal'))
			.filter(() => false);


	const joinQueue = (action$, store) =>
		action$
			.ofType(actionTypes.JOIN)
			.pluck('payload')
			.filter(() => userSelectors.isAuth(store.getState()));

	const joinQueueSuccess = ({ hasAudio, hasVideo, imgSrc }) => multipleEmits(
		actions.setLocalBubble({ hasAudio, hasVideo, imgSrc }),
		actions.toggleJoinModal({ isOpen: false }),
		broadcastActions.setUserType({ type: userTypes.QUEUE }),
		videoActions.raiseHand({ hasAudio, hasVideo }),
	);

	const joinQueueWithMic = (action$, store) =>
		joinQueue(action$, store)
			.filter(args => !args.hasVideo)
			.do(() => ga.event({
				category: 'broadcast',
				action: 'queueJoined',
				label: 'mic',
			}))
			.mergeMap(args => joinQueueSuccess(args));


	const joinQueueWithCamera = (action$, store) =>
		joinQueue(action$, store)
			.filter(args => args.hasVideo)
			.map((args) => {
				const state = store.getState();

				return {
					...args,
					clientId: broadcastSelectors.clientId(state),
					broadcastId: broadcastSelectors.broadcastId(state),
				};
			})
			.mergeMap(args =>
				expBackoff({
					promise: () => requests.setBubble(args),
					retryWhen: err => err.statusCode >= 500,
					maxRetries: 3,
					initialDelay: 200,
				})
				.do(() => ga.event({
					category: 'broadcast',
					action: 'queueJoined',
					label: 'camera',
				}))
				.mergeMap(() => joinQueueSuccess(args))
				.takeUntil(action$.ofType(broadcastActionTypes.BROADCAST_LEAVE))
				.catch((err) => {
					logger.error(err);
					return multipleEmits(
						broadcastActions.alert({ name: alerts.QUEUE_JOIN_FAILED }),
						actions.toggleJoinModal({ isOpen: false }),
					);
				}),
			);


	const convertToGuestType = (action$, store) =>
		action$
			.ofType(videoActionTypes.STREAM_STARTED)
			.pluck('payload')
			.filter(({ isPub, isTrial }) => isPub && !isTrial)
			.filter(() => !broadcastSelectors.isHost(store.getState()))
			.map(() => broadcastActions.setUserType({ type: userTypes.GUEST }));


	const converToQueueType = (action$, store) =>
		action$
			.ofType(videoActionTypes.STREAM_ENDED)
			.pluck('payload')
			.filter(({ isPub, isTrial }) => isPub && !isTrial)
			.filter(() => {
				const state = store.getState();

				return !broadcastSelectors.isHost(state) && selectors.localBubble(state);
			})
			.map(() => broadcastActions.setUserType({ type: userTypes.QUEUE }));


	const leaveQueue = (action$, store) =>
		action$
			.ofType(actionTypes.LEAVE)
			.map(() => publishSelectors.pubStreamId(store.getState()))
			.mergeMap(pubStreamId => Observable.merge(
				obsOf(broadcastActions.setUserType({ type: userTypes.VIEWER })),
				obsOf(actions.removeLocalBubble()),
				obsOf(videoActions.lowerHand()),
				Observable.if(
					() => pubStreamId,
					obsOf(videoActions.unpublish({ id: pubStreamId })),
					Observable.empty(),
				),
			));


	const publishWhenSummoned = (action$, store) =>
		action$
			.ofType(videoActionTypes.SUMMONED)
			.map(() => selectors.localBubble(store.getState()))
			.filter(localBubble => localBubble)
			.map(({ hasAudio, hasVideo }) =>
				publishActions.guestPublish({ hasAudio, hasVideo }));


	const getBubble = (action$, store) =>
		action$
			.ofType(videoActionTypes.REMOTE_HAND_RAISED)
			.pluck('payload')
			.map(({ clientId: videoClientId, clientInfo, hasAudio, hasVideo }) => ({
				...parseJsonDict(clientInfo),
				videoClientId,
				hasAudio,
				hasVideo,
				broadcastId: broadcastSelectors.broadcastId(store.getState()),
			}))
			.filter(args => (
				typeof args.username === 'string' &&
				typeof args.clientId === 'string' &&
				args.broadcastId
			));


	const getAudioBubble = (action$, store) =>
		getBubble(action$, store)
			.filter(args => !args.hasVideo)
			.map(args => actions.appendBubble(args));


	const getVideoBubble = (action$, store) =>
		getBubble(action$, store)
			.filter(args => args.hasVideo)
			.mergeMap(args =>
				expBackoff({
					promise: () => requests.getBubble(args),
					retryWhen: err => err.statusCode >= 500,
					maxRetries: 6,
					initialDelay: 200,
				})
				.pluck('body', 'imgSrc')
				.filter(imgSrc => isBase64Img(imgSrc))
				.map(imgSrc => actions.appendBubble({ ...args, imgSrc }))
				.takeUntil(action$.ofType(broadcastActionTypes.BROADCAST_LEAVE))
				.catch((err) => {
					logger.error(err);
					// Fail silently
					return Observable.empty();
				}),
			);


	const kickGuestFromQueue = action$ =>
		action$
			.ofType(actionTypes.KICK)
			.pluck('payload')
			.mergeMap(({ clientId, videoClientId }) => multipleEmits(
				videoActions.ignoreHand({ clientId: videoClientId }),
				actions.removeBubble({ clientId }),
			));


	const removeBubble = action$ =>
		action$
			.ofType(videoActionTypes.REMOTE_HAND_LOWERED)
			.pluck('payload', 'clientInfo')
			.map(clientInfo => parseJsonDict(clientInfo))
			.map(({ clientId }) => actions.removeBubble({ clientId }));


	const summon = action$ =>
		action$
			.ofType(actionTypes.GUEST_SUMMON)
			.pluck('payload')
			.mergeMap(({ /* clientId, */ videoClientId }) => Observable.merge(
				// obsOf(actions.removeBubble({ clientId })),
				obsOf(videoActions.summon({ clientId: videoClientId })),
			));


	const unsummon = action$ =>
		action$
			.ofType(actionTypes.GUEST_UNSUMMON)
			.pluck('payload')
			.map(args => videoActions.unsummon({ clientId: args.videoClientId }));


	const summonIfAutoJoin = (action$, store) =>
		action$
			.ofType(actionTypes.BUBBLE_APPEND)
			.filter(() => broadcastSelectors.isAutoJoinOn(store.getState()))
			.pluck('payload')
			.map(args => actions.summonGuest(args));


	return combineEpics(
		closeModalIfCaptureFails,
		unpubTrialWhenModalCloses,
		unpubTrialIfModalClosed,
		loginToJoinQueue,
		clickJoinAfterLogin,
		autoJoin,
		clearStorageWhenLoginModalCloses,
		joinQueueWithMic,
		joinQueueWithCamera,
		leaveQueue,
		convertToGuestType,
		converToQueueType,
		publishWhenSummoned,
		getAudioBubble,
		getVideoBubble,
		kickGuestFromQueue,
		removeBubble,
		summon,
		unsummon,
		summonIfAutoJoin,
	);
};
