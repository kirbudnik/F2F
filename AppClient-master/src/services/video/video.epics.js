export default ({
	Observable,
	actionTypes,
	actions,
	f2f,
	logger,
	options,
}) => {
	// Return empty object if f2f is not provided. Prevents code from crashing
	// during local tests without a video library.
	if (f2f === null) {
		return {};
	}

	function parseJsonDict(json) {
		try {
			const dict = JSON.parse(json);
			return dict instanceof Object ? dict : {};
		} catch (err) {
			return {};
		}
	}

	// Return null if invalid. Otherwise, ensure data is an object so it
	// may be deconstructed further down the chain.
	function validateAppMessage(msg) {
		if (!(msg instanceof Object) || typeof msg.type !== 'string') {
			return null;
		}
		if (msg.data instanceof Object) {
			return msg;
		}
		return { ...msg, data: {} };
	}

	const isPositiveInteger = num => Number.isInteger(num) && num > 0;

	const areJsonDictsEqual = (dict1, dict2) => JSON.stringify(dict1) === JSON.stringify(dict2);

	const stop = () => false;

	const listen = (obj, eventName) =>
		Observable.fromEventPattern(
			handler => obj.on(eventName, handler),
			handler => obj.off(eventName, handler),
		);

	const emitError = (err) => {
		logger.error(err);
		return Observable.of(actions.error(err));
	};

	const absorbError = (err) => {
		logger.error(err);
		return Observable.empty();
	};

	const isLeaveOrJoinAction = ({ type }) =>
		type === actionTypes.ROOM_LEAVE ||
		type === actionTypes.ROOM_JOIN;

	const isThisStream = stream => action => action.payload.id === stream.id;

	const thisStreamEnded = (action$, stream) =>
		action$
			.ofType(actionTypes.STREAM_ENDED)
			.filter(isThisStream(stream));

	// Bind this stream to the specified video element
	const attachVideoElement = (action$, stream) =>
		action$
			.ofType(actionTypes.STREAM_ATTACH_VIDEO_ELEMENT)
			.filter(isThisStream(stream))
			.pluck('payload')
			.mergeMap(({ video, speakerId }) => Observable
				.bindNodeCallback(stream.attachVideoElement)(video, speakerId)
				.filter(stop)
				.catch(emitError));


	// Must register a callback function for audio changes. This will be fired very
	// frequently and we do not want to emit actions on every change.
	const bindAudioListener = (action$, stream) =>
		action$
			.ofType(actionTypes.STREAM_BIND_AUDIO_LISTENER)
			.filter(isThisStream(stream))
			.pluck('payload', 'callback')
			.do(callback => stream.on('audioLevel', callback))
			.filter(stop);


	const unbindAudioListener = (action$, stream) =>
		action$
			.ofType(actionTypes.STREAM_UNBIND_AUDIO_LISTENER)
			.filter(isThisStream(stream))
			.do(() => stream.off('audioLevel'))
			.filter(stop);

	const unpublishListener = (action$, stream) =>
		action$
			.ofType(actionTypes.STREAM_UNPUBLISH)
			.filter(isThisStream(stream))
			.do(() => stream.unpublish())
			.filter(stop);


	const configureStream = (action$, stream) =>
		action$
			.ofType(actionTypes.STREAM_CONFIGURE)
			.filter(isThisStream(stream))
			.pluck('payload')
			.mergeMap(({
				hasAudio,
				hasVideo,
				audioDeviceId,
				videoDeviceId,
			}) => Observable
				.bindNodeCallback(stream.configure)({
					hasAudio,
					hasVideo,
					audioDeviceId,
					videoDeviceId,
				})
				.filter(stop)
				.catch(emitError));


	const emitStreamStarted = (stream) => {
		const state = stream.getState();

		return actions.streamStarted({
			...state,
			clientInfo: parseJsonDict(state.clientInfo),
		});
	};

	// Possible statuses = 'connecting', 'connected', 'reconnecting', 'ended'.
	const detectStatusChanges = stream =>
		listen(stream, 'statusChange')
			.map(newState => actions.streamStatus(newState));

	const detectStreamUpdates = stream =>
		listen(stream, 'updated')
			.map(newState => actions.streamUpdated(newState));

	const detectStreamEnd = stream =>
		listen(stream, 'ended')
			.map(newState => actions.streamEnded(newState));

	// Add listeners for a remote stream
	const onRemoteStream = (action$, stream) => Observable.merge(
		detectStatusChanges(stream),
		detectStreamUpdates(stream),
		detectStreamEnd(stream),
		attachVideoElement(action$, stream),
		bindAudioListener(action$, stream),
		unbindAudioListener(action$, stream),
		Observable.of(emitStreamStarted(stream)),
	)
	.takeUntil(thisStreamEnded(action$, stream))
	.catch(absorbError);

	// Add listeners for a local publisher stream
	const onLocalStream = (action$, stream) => Observable.merge(
		detectStatusChanges(stream),
		detectStreamUpdates(stream),
		detectStreamEnd(stream),
		attachVideoElement(action$, stream),
		bindAudioListener(action$, stream),
		unbindAudioListener(action$, stream),
		unpublishListener(action$, stream),
		configureStream(action$, stream),
		action$
			.ofType(actionTypes.STREAM_SET_BITRATE)
			.filter(isThisStream(stream))
			.do(action => stream.bitrate(action.payload.kbps))
			.filter(stop),
		action$
			.ofType(actionTypes.STREAM_SET_PLACEMENT)
			.filter(isThisStream(stream))
			.do(action => stream.placement(action.payload))
			.filter(stop),
		Observable.of(emitStreamStarted(stream)),
	)
	.takeUntil(thisStreamEnded(action$, stream))
	.catch(absorbError);


	// Add listeners for a trial stream
	const onTrialStream = (action$, stream) => Observable.merge(
		detectStatusChanges(stream),
		detectStreamEnd(stream),
		attachVideoElement(action$, stream),
		bindAudioListener(action$, stream),
		unbindAudioListener(action$, stream),
		unpublishListener(action$, stream),
		configureStream(action$, stream),
		Observable.of(emitStreamStarted(stream)),
	)
	.takeUntil(thisStreamEnded(action$, stream))
	.catch(absorbError);


	// Add listeners for a new room
	const onRoomJoin = (action$, room) => Observable.merge(
		listen(room, 'stream')
			.mergeMap(stream => onRemoteStream(action$, stream)),
		listen(room, 'summoned')
			.mapTo(actions.summoned()),
		listen(room, 'message')
			.map(json => parseJsonDict(json))
			.map(validateAppMessage)
			.filter(msg => msg !== null)
			.map(message => actions.appMessage(message)),
		listen(room, 'error')
			.map(err => actions.error(err)),
		listen(room, 'close')
			.mapTo(actions.roomClosed({ roomId: room.id })),
		action$
			.ofType(actionTypes.VIEWER_COUNT_LISTEN)
			.switchMap(() =>
				listen(room, 'viewerCount')
					.map(count => actions.viewerCount({ count }))
					.takeUntil(action$.ofType(actionTypes.VIEWER_COUNT_MUTE))),
		action$
			.ofType(actionTypes.REMOTE_HANDS_LISTEN)
			.switchMap(() => Observable.merge(
				listen(room, 'handRaised')
					.map(args => actions.remoteHandRaised(args))
					.takeUntil(action$.ofType(actionTypes.REMOTE_HANDS_MUTE)),
				listen(room, 'handLowered')
					.map(args => actions.remoteHandLowered(args))
					.takeUntil(action$.ofType(actionTypes.REMOTE_HANDS_MUTE)),
				),
			),
		action$
			.filter(isLeaveOrJoinAction)
			.do(() => room.leave())
			.filter(stop),
		action$
			.ofType(actionTypes.SUMMON)
			.pluck('payload', 'clientId')
			.do(clientId => room.summon(clientId))
			.filter(stop),
		action$
			.ofType(actionTypes.UNSUMMON)
			.pluck('payload', 'clientId')
			.do(clientId => room.unsummon(clientId))
			.filter(stop),
		action$
			.ofType(actionTypes.HAND_RAISE)
			.pluck('payload')
			.do(payload => room.raiseHand(payload))
			.filter(stop),
		action$
			.ofType(actionTypes.HAND_LOWER)
			.do(() => room.lowerHand())
			.filter(stop),
		action$
			.ofType(actionTypes.HAND_IGNORE)
			.pluck('payload', 'clientId')
			.do(clientId => room.ignoreHand(clientId))
			.filter(stop),
		action$
			.ofType(actionTypes.RESTREAM_ADD_KEY)
			.pluck('payload', 'key')
			.mergeMap(key => Observable
				.bindNodeCallback(room.addStreamKey)(key)
				.map(() => actions.restreamKeyAdded({ key }))
				.catch(() => Observable.of(actions.addRestreamKeyFailed({ key })))),
		action$
			.ofType(actionTypes.RESTREAM_REMOVE_KEY)
			.pluck('payload', 'key')
			.mergeMap(key => Observable
				.bindNodeCallback(room.removeStreamKey)(key)
				.filter(stop)
				.catch(emitError)),
		action$
			.ofType(actionTypes.PUBLISH)
			.pluck('payload')
			.filter(args => !args.isScreen)
			.exhaustMap(args => Observable
				.bindNodeCallback(room.publish)(args)
				.mergeMap(stream => onLocalStream(action$, stream))
				.catch(err => Observable.of(actions.publishFailed(err)))),
		action$
			.ofType(actionTypes.PUBLISH)
			.pluck('payload')
			.filter(args => args.isScreen)
			.exhaustMap(args => Observable
				.bindNodeCallback(room.publish)(args)
				.mergeMap(stream => onLocalStream(action$, stream))
				.catch(err => Observable.of(actions.publishFailed(err)))),
		action$
			.ofType(actionTypes.TRIAL_PUBLISH)
			.pluck('payload')
			.exhaustMap(args => Observable
				.bindNodeCallback(room.trialPublish)(args)
				.mergeMap(stream => onTrialStream(action$, stream))
				.catch(err => Observable.of(actions.trialPublishFailed(err)))),
		Observable.of(actions.joinedRoom({ roomId: room.id })),
	)
	.takeUntil(action$.ofType(actionTypes.ROOM_CLOSED))
	.catch(absorbError);


	// --- Top level epics ---

	// Main listener for joining a room
	const joinRoom = action$ =>
		action$
			.ofType(actionTypes.ROOM_JOIN)
			.pluck('payload')
			.mergeMap(({ roomId, token }) => {
				let shouldLeave = false;

				// If we get a leave request or new join req before callback resolves
				// then we should immediately leave the room and complete.
				return Observable.merge(
					Observable
						.bindNodeCallback(f2f.room)(roomId, token)
						.filter((room) => {
							if (shouldLeave) {
								room.leave();
								return false;
							}
							return true;
						})
						.switchMap(room => onRoomJoin(action$, room))
						.catch(err => Observable.merge(
							Observable.of(actions.joinRoomFailed({ roomId, err })),
							Observable.of(actions.error(err)),
						)),
					// FIXME - Do we need this to complete?
					action$
						.filter(isLeaveOrJoinAction)
						.do(() => {
							shouldLeave = true;
						})
						.filter(stop),
				);
			});


	const scanForDevices = action$ =>
		action$
			.first()
			.filter(() => isPositiveInteger(options.deviceRefreshInterval))
			.mergeMap(() => Observable
				.interval(options.deviceRefreshInterval)
				.startWith(0)
				.switchMap(() => Observable.bindNodeCallback(f2f.scanForDevices)())
				.distinctUntilChanged((prev, cur) => areJsonDictsEqual(prev, cur))
				.map(devices => actions.devicesUpdate(devices))
				.catch(emitError),
			);


	// Emit system report on load then poll to detect if it updates.
	// Only value that actually changes is whether a browser extension has been detected.
	const systemReports = action$ =>
		action$
			.first()
			.filter(() => isPositiveInteger(options.systemReportInterval))
			.mergeMap(() => Observable
				.interval(options.systemReportInterval)
				.startWith(0)
				.map(() => f2f.systemReport())
				.distinctUntilChanged((prev, cur) => areJsonDictsEqual(prev, cur))
				.map(system => actions.systemReport({ system })),
			);

	return {
		joinRoom,
		scanForDevices,
		systemReports,
	};
};
