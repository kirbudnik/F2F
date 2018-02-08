const initialState = {
	system: {},
	isBroadcast404: false,
	broadcastId: null,
	broadcastName: null,
	clientId: null,
	userType: null,
	hostUsername: null,
	isUnlisted: null,
	isVideoConnected: false,
	isLive: false,
	viewerCount: 1,
	volume: 100,
	videoLayout: 'group',
	videoLayoutOnDeck: null,
	streams: {},
	alerts: [],
	isViewerCountOn: true,
	isAutoJoinOn: false,
	isQueueSoundOn: true,
	isPayBtnOn: false,
	isStripeConnected: false,
};


const handleActions = handlers => (state = initialState, action) => {
	if (action.type in handlers) {
		return handlers[action.type](state, action.payload);
	}
	return state;
};

export default ({
	actionTypes,
	userActionTypes,
	videoActionTypes,
	userTypes,
	addPlacements,
}) => handleActions({
	[userActionTypes.AUTH_SUCCESS]: (state, { pay }) => ({
		...state,
		isStripeConnected: pay instanceof Object && pay.isStripeConnected,
	}),

	[actionTypes.BROADCAST_LEAVE]: state => ({
		...initialState,
		system: state.system,
		isStripeConnected: state.isStripeConnected,
	}),

	[actionTypes.BROADCAST_JOIN_404]: state => ({
		...state,
		isBroadcast404: true,
	}),

	[actionTypes.BROADCAST_JOIN_SUCCESS]: (state, payload) => ({
		...state,
		broadcastId: payload.broadcastId,
		broadcastName: payload.broadcastName,
		clientId: payload.clientId,
		userType: payload.isHost ? userTypes.HOST : userTypes.VIEWER,
		videoLayout: payload.broadcast.layout,
		isLive: payload.broadcast.isLive,
		hostUsername: payload.broadcast.hostUsername,
		isUnlisted: payload.broadcast.isUnlisted,
		isViewerCountOn: payload.broadcast.isViewerCountOn,
		isAutoJoinOn: payload.broadcast.isAutoJoinOn,
		isQueueSoundOn: payload.broadcast.isQueueSoundOn,
		isPayBtnOn: payload.broadcast.isPayBtnOn,
	}),

	[actionTypes.BROADCAST_LIVE_SET]: (state, { isLive }) => ({
		...state,
		isLive,
	}),

	[actionTypes.SETTINGS_TOGGLE]: (state, settings) => ({
		...state,
		...settings,
	}),

	[actionTypes.VIEWER_COUNT_TOGGLE]: (state, { isOn }) => ({
		...state,
		isViewerCountOn: isOn,
	}),

	[actionTypes.AUTO_JOIN_TOGGLE]: (state, { isOn }) => ({
		...state,
		isAutoJoinOn: isOn,
	}),

	[actionTypes.VOLUME_SET]: (state, { volume }) => ({
		...state,
		volume,
	}),

	[actionTypes.LAYOUT_SET]: (state, { layout }) => ({
		...state,
		videoLayout: layout,
		streams: addPlacements(state.streams, layout),
		videoLayoutOnDeck: layout === state.videoLayoutOnDeck ? null : state.videoLayoutOnDeck,
	}),

	[actionTypes.LAYOUT_ON_DECK_SET]: (state, { layout }) => ({
		...state,
		videoLayoutOnDeck: layout,
	}),

	[actionTypes.USER_TYPE_SET]: (state, { type }) => ({
		...state,
		userType: type,
	}),

	[actionTypes.ALERTS_CLOSE]: (state, payload) => ({
		...state,
		alerts: state.alerts.filter(({ name }) => name !== payload.name),
	}),

	[actionTypes.ALERTS_OPEN]: (state, payload) => ({
		...state,
		alerts: [...state.alerts.filter(({ name }) => name !== payload.name), payload],
	}),

	[videoActionTypes.ROOM_JOIN_SUCCESS]: state => ({
		...state,
		isVideoConnected: true,
	}),

	[videoActionTypes.ROOM_CLOSED]: state => ({
		...state,
		isVideoConnected: false,
	}),

	[videoActionTypes.STREAM_STARTED]: (state, {
		id,
		isPub,
		isTrial,
		isScreen,
		hasAudio,
		hasVideo,
		startedAt,
		audioDeviceId,
		videoDeviceId,
		status,
		role,
		clientInfo,
		clientId: videoClientId,
	}) => {
		if (!isTrial) {
			const { username, clientId } = clientInfo;

			const stream = {
				id,
				isPub,
				isTrial,
				isScreen,
				hasAudio,
				hasVideo,
				startedAt,
				username,
				clientId,
				videoClientId,
				role,
				audioDeviceId,
				videoDeviceId,
				status,
			};

			return {
				...state,
				streams: addPlacements(
					{
						...state.streams,
						[id]: stream,
					},
					state.videoLayout,
				),
			};
		}
		return state;
	},

	[videoActionTypes.STREAM_STATUS]: (state, { id, status }) => {
		const stream = state.streams[id];

		if (stream) {
			return {
				...state,
				streams: {
					...state.streams,
					[id]: {
						...stream,
						status,
					},
				},
			};
		}
		return state;
	},

	[videoActionTypes.STREAM_UPDATED]: (state, { id, hasAudio, hasVideo }) => {
		const stream = state.streams[id];

		if (stream && !stream.isTrial) {
			return {
				...state,
				streams: addPlacements(
					{
						...state.streams,
						[id]: {
							...stream,
							hasAudio,
							hasVideo,
						},
					},
					state.videoLayout,
				),
			};
		}
		return state;
	},

	[videoActionTypes.STREAM_ENDED]: (state, { id }) => {
		const stream = state.streams[id];

		if (stream) {
			const streams = { ...state.streams };

			delete streams[id];

			return {
				...state,
				streams: addPlacements(streams, state.videoLayout),
			};
		}
		return state;
	},

	[videoActionTypes.VIEWER_COUNT]: (state, payload) => ({
		...state,
		viewerCount: payload.count,
	}),

	[videoActionTypes.SYSTEM_REPORT]: (state, { system }) => ({
		...state,
		system,
	}),
});


// Selectors
const selectors = {};
Object.keys(initialState).forEach((key) => {
	selectors[key] = state => state.broadcast[key];
});


// Reselect
export const Selectors = (createSelector, userTypes) => ({
	// TODO - Only export raw selectors that are needed
	...selectors,
	...selectors.settings,
	isBroadcastVisible: createSelector(
		[selectors.broadcastId],
		broadcastId => broadcastId !== null,
	),
	streams: createSelector(
		[selectors.streams],
		streams => Object.keys(streams).map(id => streams[id]),
	),
	streamsById: createSelector(
		[selectors.streams],
		streams => streams,
	),
	publisherClientIds: createSelector(
		[selectors.streams],
		streams => Object.keys(streams).map(id => streams[id].clientId),
	),
	hiddenStreamIds: createSelector(
		[selectors.streams],
		streams => Object.keys(streams).filter(id => streams[id].isHiddenByLayout),
	),
	isAnyoneScreenSharing: createSelector(
		[selectors.streams],
		streams => Object.keys(streams).filter(id => (
			streams[id].isScreen &&
			!streams[id].isTrial
		)).length > 0,
	),
	isHost: createSelector(
		[selectors.userType],
		type => type === userTypes.HOST,
	),
	isInQueue: createSelector(
		[selectors.userType],
		type => type === userTypes.QUEUE,
	),
	hasVideoLibLoaded: createSelector(
		[selectors.system],
		system => Object.keys(system).length > 0,
	),
	isWebrtcEnabled: createSelector(
		[selectors.system],
		system => system.isWebrtcEnabled,
	),
	isWebrtcBrowser: createSelector(
		[selectors.system],
		system => system.isWebrtcBrowser,
	),
	isWebrtcBrowserUpdateRequired: createSelector(
		[selectors.system],
		system => system.isWebrtcBrowserUpdateRequired,
	),
	isIOS: createSelector(
		[selectors.system],
		system => system.isIOS,
	),
	isOldIOS: createSelector(
		[selectors.system],
		system => system.isIOS && system.osVersion < system.webrtcRequirements.iOS,
	),
	isSpeakerSelectionSupported: createSelector(
		[selectors.system],
		system => system.isSpeakerSelectionSupported,
	),
	settings: createSelector(
		[
			selectors.isViewerCountOn,
			selectors.isAutoJoinOn,
			selectors.isQueueSoundOn,
			selectors.isPayBtnOn,
			selectors.isStripeConnected,
		],
		(isViewerCountOn, isAutoJoinOn, isQueueSoundOn, isPayBtnOn, isStripeConnected) => ([
			{
				id: 'isAutoJoinOn',
				text: 'Auto-join (meetings)',
				value: isAutoJoinOn,
			},
			{
				id: 'isViewerCountOn',
				text: 'Audience can see viewer count',
				value: isViewerCountOn,
			},
			{
				id: 'isQueueSoundOn',
				text: 'Queue "ding" sound',
				value: isQueueSoundOn,
			},
			{
				id: 'isPayBtnOn',
				text: 'F2F Pay button',
				value: isStripeConnected && isPayBtnOn,
				isDisabled: !isStripeConnected,
			},
		]),
	),
});
