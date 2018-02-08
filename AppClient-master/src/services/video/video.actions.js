const create = type => payload => ({ type, payload });
const createEmpty = type => () => ({ type });

export const actionTypes = {
	ROOM_JOIN: 'video/room/join',
	ROOM_JOIN_SUCCESS: 'video/room/join/success',
	ROOM_JOIN_FAILURE: 'video/room/join/failure',
	ROOM_LEAVE: 'video/room/leave',
	ROOM_CLOSED: 'video/room/closed',

	PUBLISH: 'video/publish',
	PUBLISH_FAILED: 'video/publish/failed',
	TRIAL_PUBLISH: 'video/publish/trial',
	TRIAL_PUBLISH_FAILED: 'video/publish/trial/failed',

	STREAM_STARTED: 'video/stream/started',
	STREAM_UPDATED: 'video/stream/updated',
	STREAM_STATUS: 'video/stream/status',
	STREAM_ENDED: 'video/stream/ended',

	STREAM_UNPUBLISH: 'video/stream/unpublish',
	STREAM_CONFIGURE: 'video/stream/configure',
	STREAM_SET_BITRATE: 'video/stream/bitrate/set',
	STREAM_SET_PLACEMENT: 'video/stream/placement/set',
	STREAM_ATTACH_VIDEO_ELEMENT: 'video/stream/video_element/attach',
	STREAM_BIND_AUDIO_LISTENER: 'video/stream/audio_listener/bind',
	STREAM_UNBIND_AUDIO_LISTENER: 'video/stream/audio_listener/unbind',

	REMOTE_HAND_RAISED: 'video/remote_hands/raised',
	REMOTE_HAND_LOWERED: 'video/remote_hands/lowered',
	REMOTE_HANDS_LISTEN: 'video/remote_hands/listen',
	REMOTE_HANDS_MUTE: 'video/remote_hands/mute',

	HAND_RAISE: 'video/hand/raise',
	HAND_LOWER: 'video/hand/lower',
	HAND_IGNORE: 'video/hand/ignore',

	RESTREAM_ADD_KEY: 'video/restream/add',
	RESTREAM_ADD_KEY_SUCCESS: 'video/restream/add/success',
	RESTREAM_ADD_KEY_FAILURE: 'video/restream/add/failure',
	RESTREAM_REMOVE_KEY: 'video/restream/remove',

	SUMMON: 'video/summon',
	UNSUMMON: 'video/unsummon',
	SUMMONED: 'video/summoned',

	VIEWER_COUNT: 'video/viewer_count',
	VIEWER_COUNT_LISTEN: 'video/viewer_count/listen',
	VIEWER_COUNT_MUTE: 'video/viewer_count/mute',

	APP_MESSAGE: 'video/app_message',
	SYSTEM_REPORT: 'video/system/report',
	DEVICES_UPDATE: 'video/devices/update',
	ERROR: 'video/error',
};

export default {
	joinRoom: create(actionTypes.ROOM_JOIN),
	joinedRoom: create(actionTypes.ROOM_JOIN_SUCCESS),
	joinRoomFailed: create(actionTypes.ROOM_JOIN_FAILURE),
	leaveRoom: createEmpty(actionTypes.ROOM_LEAVE),
	roomClosed: create(actionTypes.ROOM_CLOSED),

	publish: create(actionTypes.PUBLISH),
	publishFailed: create(actionTypes.PUBLISH_FAILED),
	trialPublish: create(actionTypes.TRIAL_PUBLISH),
	trialPublishFailed: create(actionTypes.TRIAL_PUBLISH_FAILED),

	streamStarted: create(actionTypes.STREAM_STARTED),
	streamUpdated: create(actionTypes.STREAM_UPDATED),
	streamStatus: create(actionTypes.STREAM_STATUS),
	streamEnded: create(actionTypes.STREAM_ENDED),

	unpublish: create(actionTypes.STREAM_UNPUBLISH),
	configureStream: create(actionTypes.STREAM_CONFIGURE),
	setBitrate: create(actionTypes.STREAM_SET_BITRATE),
	setPlacement: create(actionTypes.STREAM_SET_PLACEMENT),
	attachVideoElement: create(actionTypes.STREAM_ATTACH_VIDEO_ELEMENT),
	bindAudioListener: create(actionTypes.STREAM_BIND_AUDIO_LISTENER),
	unbindAudioListener: create(actionTypes.STREAM_UNBIND_AUDIO_LISTENER),

	remoteHandRaised: create(actionTypes.REMOTE_HAND_RAISED),
	remoteHandLowered: create(actionTypes.REMOTE_HAND_LOWERED),
	listenToRemoteHands: create(actionTypes.REMOTE_HANDS_LISTEN),
	muteRemoteHands: create(actionTypes.REMOTE_HANDS_MUTE),

	raiseHand: create(actionTypes.HAND_RAISE),
	lowerHand: create(actionTypes.HAND_LOWER),
	ignoreHand: create(actionTypes.HAND_IGNORE),

	addRestreamKey: create(actionTypes.RESTREAM_ADD_KEY),
	restreamKeyAdded: create(actionTypes.RESTREAM_ADD_KEY_SUCCESS),
	addRestreamKeyFailed: create(actionTypes.RESTREAM_ADD_KEY_FAILURE),
	removeRestreamKey: create(actionTypes.RESTREAM_REMOVE_KEY),

	summon: create(actionTypes.SUMMON),
	unsummon: create(actionTypes.UNSUMMON),
	summoned: createEmpty(actionTypes.SUMMONED),

	viewerCount: create(actionTypes.VIEWER_COUNT),
	listenToViewerCount: create(actionTypes.VIEWER_COUNT_LISTEN),
	muteViewerCount: create(actionTypes.VIEWER_COUNT_MUTE),

	appMessage: create(actionTypes.APP_MESSAGE),
	systemReport: create(actionTypes.SYSTEM_REPORT),
	devicesUpdate: create(actionTypes.DEVICES_UPDATE),
	error: create(actionTypes.ERROR),
};
