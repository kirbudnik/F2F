const create = type => payload => ({ type, payload });
const createEmpty = type => () => ({ type });

export const actionTypes = {
	BROADCAST_START_PUBLIC: 'broadcast/start/public',
	BROADCAST_START_UNLISTED: 'broadcast/start/unlisted',
	BROADCAST_START_FAILURE: 'broadcast/start/failure',
	BROADCAST_LIVE_CLICK: 'broadcast/live/click',
	BROADCAST_LIVE_FAILURE: 'broadcast/live/failure',
	BROADCAST_LIVE_SET: 'broadcast/live/set',
	BROADCAST_END: 'broadcast/end',
	BROADCAST_GET: 'broadcast/get',

	BROADCAST_JOIN: 'broadcast/join',
	BROADCAST_JOIN_SUCCESS: 'broadcast/join/success',
	BROADCAST_JOIN_FAILURE: 'broadcast/join/failure',
	BROADCAST_JOIN_404: 'broadcast/join/404',
	BROADCAST_LEAVE: 'broadcast/leave',

	VOLUME_SET: 'broadcast/volume/set',

	LAYOUT_CLICK: 'broadcast/layout/click',
	LAYOUT_ON_DECK_SET: 'broadcast/layout/on_deck/set',
	LAYOUT_SET: 'broadcast/layout/set',

	SETTINGS_CLICKED: 'broadcast/settings/clicked',
	SETTINGS_TOGGLE: 'broadcast/settings/toggle',

	ALERTS_CLOSE: 'broadcast/alerts/close',
	ALERTS_OPEN: 'broadcast/alerts/open',

	EXTENSION_DOWNLOAD: 'broadcast/extension/download',

	USER_TYPE_SET: 'brodcast/user_type/set',
};

export default {
	startPublicBroadcast: create(actionTypes.BROADCAST_START_PUBLIC),
	startUnlistedBroadcast: create(actionTypes.BROADCAST_START_UNLISTED),
	startBroadcastFailed: create(actionTypes.BROADCAST_START_FAILURE),
	goLiveClick: create(actionTypes.BROADCAST_LIVE_CLICK),
	goLiveFailed: create(actionTypes.BROADCAST_LIVE_FAILURE),
	setIsLive: create(actionTypes.BROADCAST_LIVE_SET),
	endBroadcast: create(actionTypes.BROADCAST_END),
	getBroadcast: create(actionTypes.BROADCAST_GET),

	joinBroadcast: create(actionTypes.BROADCAST_JOIN),
	joinBroadcastSuccess: create(actionTypes.BROADCAST_JOIN_SUCCESS),
	joinBroadcastFailed: create(actionTypes.BROADCAST_JOIN_FAILURE),
	joinBroadcast404: create(actionTypes.BROADCAST_JOIN_404),
	leaveBroadcast: createEmpty(actionTypes.BROADCAST_LEAVE),

	setVolume: create(actionTypes.VOLUME_SET),

	layoutBtnClick: create(actionTypes.LAYOUT_CLICK),
	setOnDeckLayout: create(actionTypes.LAYOUT_ON_DECK_SET),
	setLayout: create(actionTypes.LAYOUT_SET),

	settingClicked: create(actionTypes.SETTINGS_CLICKED),
	toggleSettings: create(actionTypes.SETTINGS_TOGGLE),

	closeAlert: create(actionTypes.ALERTS_CLOSE),
	alert: create(actionTypes.ALERTS_OPEN),

	downloadExtension: create(actionTypes.EXTENSION_DOWNLOAD),

	setUserType: create(actionTypes.USER_TYPE_SET),
};
