export default ({
	Observable,
	combineEpics,
	selectors,
	actions,
	actionTypes,
	videoActions,
	videoActionTypes,
	broadcastSelectors,
	broadcastActions,
	broadcastActionTypes,
	videoLayouts,
	alerts,
	localStorage,
	ga,
}) => {
	const areJsonDictsEqual = (dict1, dict2) => JSON.stringify(dict1) === JSON.stringify(dict2);

	const layoutHasScreen = layout =>
		layout === videoLayouts.NEWS ||
		layout === videoLayouts.SCREEN ||
		layout === videoLayouts.PRESENTATION;

	const onDeviceSelect = action =>
		action.type === actionTypes.MIC_SELECT ||
		action.type === actionTypes.CAMERA_SELECT;

	const stop = () => false;


	// TODO - Show notications when publish or trial publish fail

	const guestPublish = (action$, store) =>
		action$
			.ofType(actionTypes.GUEST_PUBLISH)
			.pluck('payload')
			.do(args => ga.event({
				category: 'broadcast',
				action: 'guestPublish',
				label: args.hasVideo ? 'camera' : 'mic',
			}))
			.map(({ hasAudio, hasVideo }) => {
				const state = store.getState();

				return videoActions.publish({
					hasAudio,
					hasVideo,
					audioDeviceId: selectors.selectedMicId(state),
					videoDeviceId: selectors.selectedCameraId(state),
				});
			});


	const trialPublish = (action$, store) =>
		action$
			.ofType(actionTypes.TRIAL_PUBLISH)
			.pluck('payload')
			.map(({ hasAudio, hasVideo }) => {
				const state = store.getState();
				const id = selectors.trialStreamId(state);

				if (!id) {
					return videoActions.trialPublish({
						hasAudio,
						hasVideo,
						audioDeviceId: selectors.selectedMicId(state),
						videoDeviceId: selectors.selectedCameraId(state),
					});
				}
				return null;
			})
			.filter(emit => emit);


	const micClickHandler = (action$, store) =>
		action$
			.ofType(actionTypes.MIC_CLICK)
			.map(() => {
				const state = store.getState();
				const isHost = broadcastSelectors.isHost(state);
				const streamId = selectors.pubStreamId(state);

				if (streamId) {
					if (!selectors.isMicBtnOn(state)) {
						return videoActions.configureStream({
							id: streamId,
							hasAudio: true,
							audioDeviceId: selectors.selectedMicId(state),
						});
					}
					if (!selectors.isCameraBtnOn(state) && isHost) {
						return videoActions.unpublish({ id: streamId });
					}
					return videoActions.configureStream({ id: streamId, hasAudio: false });
				}
				if (isHost) {
					ga.event({
						category: 'broadcast',
						action: 'hostPublish',
						label: 'mic',
					});
					return videoActions.publish({
						hasAudio: true,
						hasVideo: false,
						audioDeviceId: selectors.selectedMicId(state),
					});
				}
				return null;
			})
			.filter(emit => emit !== null);


	const cameraClickHandler = (action$, store) =>
		action$
			.ofType(actionTypes.CAMERA_CLICK)
			.map(() => {
				const state = store.getState();
				const isHost = broadcastSelectors.isHost(state);
				const streamId = selectors.pubStreamId(state);

				if (streamId) {
					if (!selectors.isCameraBtnOn(state)) {
						// Even if we are hidden by the layout we should try to publish.
						// Need to know right away if it will work. Will be hidden immediately.
						return videoActions.configureStream({
							id: streamId,
							hasVideo: true,
							videoDeviceId: selectors.selectedCameraId(state),
						});
					}
					if (!selectors.isMicBtnOn(state) && isHost) {
						return videoActions.unpublish({ id: streamId });
					}
					if (broadcastSelectors.hiddenStreamIds(state).includes(streamId)) {
						// Btn will track the requested state for when we are unhidden
						return actions.toggleBtns({ isCameraBtnOn: false });
					}
					return videoActions.configureStream({ id: streamId, hasVideo: false });
				}
				if (isHost) {
					ga.event({
						category: 'broadcast',
						action: 'hostPublish',
						label: 'camera',
					});
					return videoActions.publish({
						hasAudio: true,
						hasVideo: true,
						audioDeviceId: selectors.selectedMicId(state),
						videoDeviceId: selectors.selectedCameraId(state),
					});
				}
				return null;
			})
			.filter(emit => emit !== null);


	const screenClickHandler = (action$, store) =>
		action$
			.ofType(actionTypes.SCREEN_CLICK)
			.map(() => {
				const state = store.getState();
				const streamId = selectors.screenStreamId(state);

				if (streamId) {
					return videoActions.unpublish({ id: streamId });
				}
				if (selectors.isScreenEnabled(state)) {
					ga.event({
						category: 'broadcast',
						action: 'hostPublish',
						label: 'screen',
					});
					return videoActions.publish({
						isScreen: true,
						hasAudio: false,
						hasVideo: true,
					});
				}
				if (!selectors.isScreenBrowser(state)) {
					return broadcastActions.alert({ name: alerts.SCREEN_UNSUPPORTED_BROWSER });
				}
				if (selectors.isScreenBrowserUpdateRequired(state)) {
					return broadcastActions.alert({ name: alerts.SCREEN_UPDATE_BROWSER });
				}
				if (selectors.isScreenExtensionRequired(state)) {
					return broadcastActions.alert({ name: alerts.SCREEN_NO_EXTENSION });
				}
				return broadcastActions.alert({ name: alerts.SCREEN_UNSUPPORTED });
			});


	const handleStreamUpdate = (action$, store) =>
		action$
			.ofType(videoActionTypes.STREAM_UPDATED)
			.pluck('payload')
			.filter(payload => payload.id === selectors.pubStreamId(store.getState()))
			.map(({ id, hasAudio, hasVideo }) => {
				// Do not turn camera btn off if we are hidden. Video is expected to
				// cut out. Only a click should turn btn off.
				if (broadcastSelectors.hiddenStreamIds(store.getState()).includes(id)) {
					const emit = { isMicBtnOn: hasAudio };

					if (hasVideo) {
						emit.isCameraBtnOn = true;
					}
					return actions.toggleBtns(emit);
				}
				return actions.toggleBtns({
					isMicBtnOn: hasAudio,
					isCameraBtnOn: hasVideo,
				});
			});


	const repubOnDeviceChange = (actionType, isBtnOn) => (action$, store) =>
		action$
			.ofType(actionType)
			.map(() => {
				const state = store.getState();
				const streamId = selectors.pubStreamId(state);

				if (streamId && isBtnOn(state)) {
					return {
						id: streamId,
						hasAudio: selectors.isMicBtnOn(state),
						hasVideo: selectors.isCameraBtnOn(state),
						audioDeviceId: selectors.selectedMicId(state),
						videoDeviceId: selectors.selectedCameraId(state),
					};
				}
				return null;
			})
			.filter(args => args)
			.map(args => videoActions.configureStream(args));

	const repubOnMicChange = repubOnDeviceChange(
		actionTypes.MIC_SELECT,
		selectors.isMicBtnOn,
	);
	const repubOnCameraChange = repubOnDeviceChange(
		actionTypes.CAMERA_SELECT,
		selectors.isCameraBtnOn,
	);


	// Wait a moment before muting. Don't want quick layout changes to continually mute
	// and unmute. Also save video from being muted if a layout change needs to occur on start.
	const disableVideoWhenHidden = getStreamId => (action$, store) =>
		action$
			.map(() => {
				const state = store.getState();
				const streamId = getStreamId(state);
				const stream = broadcastSelectors.streamsById(state)[streamId];

				return (
					streamId !== null &&
					stream !== undefined &&
					stream.hasVideo &&
					broadcastSelectors.hiddenStreamIds(state).includes(streamId)
				);
			})
			.distinctUntilChanged()
			.debounceTime(4000)
			.filter(res => res)
			.map(() => videoActions.configureStream({
				id: getStreamId(store.getState()),
				hasVideo: false,
			}));

	const disableCameraWhenHidden = disableVideoWhenHidden(selectors.pubStreamId);
	const disableScreenWhenHidden = disableVideoWhenHidden(selectors.screenStreamId);


	const enableVideoWhenUnhidden = (getStreamId, isBtnOn) => (action$, store) =>
		action$
			.map(() => getStreamId(store.getState()))
			.filter(id => id)
			.map(id => broadcastSelectors.hiddenStreamIds(store.getState()).includes(id))
			.distinctUntilChanged()
			.filter(isHidden => !isHidden)
			.map(() => {
				const state = store.getState();
				const streamId = getStreamId(state);
				const stream = broadcastSelectors.streamsById(state)[streamId];

				if (!stream.hasVideo && isBtnOn(state)) {
					return videoActions.configureStream({
						id: getStreamId(store.getState()),
						hasVideo: true,
					});
				}
				return null;
			})
			.filter(emit => emit);

	const enableCameraWhenUnhidden =
		enableVideoWhenUnhidden(selectors.pubStreamId, selectors.isCameraBtnOn);
	const enableScreenWhenUnhidden =
		enableVideoWhenUnhidden(selectors.screenStreamId, selectors.isScreenBtnOn);


	const repubTrialOnDeviceChange = (action$, store) =>
		action$
			.filter(onDeviceSelect)
			.map(() => {
				const state = store.getState();
				const id = selectors.trialStreamId(state);

				if (id) {
					return videoActions.configureStream({
						id,
						audioDeviceId: selectors.selectedMicId(state),
						videoDeviceId: selectors.selectedCameraId(state),
					});
				}
				return null;
			})
			.filter(emit => emit);


	const autoStartHostCamera = (action$, store) =>
		action$
			.ofType(videoActionTypes.ROOM_JOIN_SUCCESS)
			.filter(() => {
				const state = store.getState();

				return (
					broadcastSelectors.isHost(state) &&
					selectors.mics(state).length > 0 &&
					selectors.cameras(state).length > 0
				);
			})
			.map(() => actions.cameraBtnClick());


	const screenShareOnLayoutClick = (action$, store) =>
		action$
			.ofType(broadcastActionTypes.LAYOUT_CLICK)
			.pluck('payload', 'layout')
			.filter(layout => (
				layoutHasScreen(layout) &&
				!broadcastSelectors.isAnyoneScreenSharing(store.getState())
			))
			.mergeMap(layout => Observable.merge(
				Observable.of(actions.screenBtnClick()),
				Observable.of(broadcastActions.setOnDeckLayout({ layout })),
			));


	const saveDevice = (actionType, key) => action$ =>
		action$
			.ofType(actionType)
			.pluck('payload', 'id')
			.do(id => localStorage.setItem(key, id))
			.filter(stop);

	const saveMicToLocalStorage = saveDevice(actionTypes.MIC_SELECT, 'selectedMicId');
	const saveCameraToLocalStorage = saveDevice(actionTypes.CAMERA_SELECT, 'selectedCameraId');
	const saveSpeakerToLocalStorage = saveDevice(actionTypes.SPEAKER_SELECT, 'selectedSpeakerId');


	const retrieveDevice = (key, selector, action) => (action$, store) =>
		action$
			.ofType(videoActionTypes.DEVICES_UPDATE)
			.map(() => localStorage.getItem(key))
			.filter(id => id)
			.map(id => id.replace(/"/g, ''))
			.filter(id => id !== selector(store.getState()))
			.map(id => action({ id }));

	const retrieveMicFromLocalStorage = retrieveDevice(
		'selectedMicId',
		selectors.selectedMicId,
		actions.selectMic,
	);

	const retrieveCameraFromLocalStorage = retrieveDevice(
		'selectedCameraId',
		selectors.selectedCameraId,
		actions.selectCamera,
	);

	const retrieveSpeakerFromLocalStorage = retrieveDevice(
		'selectedSpeakerId',
		selectors.selectedSpeakerId,
		actions.selectSpeaker,
	);


	const sendRestreamCoords = isScreen => (action$, store) =>
		action$
			.map(() => {
				const state = store.getState();
				const streamId = isScreen ?
					selectors.screenStreamId(state) :
					selectors.pubStreamId(state);

				if (streamId) {
					return {
						id: streamId,
						...broadcastSelectors.streamsById(state)[streamId].restreamCoords,
					};
				}
				return null;
			})
			.filter(args => args !== null)
			.distinctUntilChanged(areJsonDictsEqual)
			.map(args => videoActions.setPlacement(args));

	const sendPubRestreamCoords = sendRestreamCoords(false);
	const sendScreenRestreamCoords = sendRestreamCoords(true);


	// TODO - Should delay emissions only if bitrate was decreased
	const sendBitrates = getStreamId => (action$, store) =>
		action$
			.map(() => getStreamId(store.getState()))
			.filter(id => id)
			.map(id => ({
				id,
				kbps: broadcastSelectors.streamsById(store.getState())[id].bitrate,
			}))
			.filter(args => args.kbps !== null)
			.distinctUntilChanged((prev, cur) => areJsonDictsEqual(prev, cur))
			.debounceTime(1000)
			.map(args => videoActions.setBitrate(args));

	const sendPubBitrates = sendBitrates(selectors.pubStreamId);
	const sendScreenBitrates = sendBitrates(selectors.screenStreamId);


	return combineEpics(
		guestPublish,
		trialPublish,
		micClickHandler,
		cameraClickHandler,
		screenClickHandler,
		disableCameraWhenHidden,
		disableScreenWhenHidden,
		enableCameraWhenUnhidden,
		enableScreenWhenUnhidden,
		handleStreamUpdate,
		repubOnMicChange,
		repubOnCameraChange,
		repubTrialOnDeviceChange,
		autoStartHostCamera,
		screenShareOnLayoutClick,
		saveMicToLocalStorage,
		saveCameraToLocalStorage,
		saveSpeakerToLocalStorage,
		retrieveMicFromLocalStorage,
		retrieveCameraFromLocalStorage,
		retrieveSpeakerFromLocalStorage,
		sendPubRestreamCoords,
		sendScreenRestreamCoords,
		sendPubBitrates,
		sendScreenBitrates,
	);
};
