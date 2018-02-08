const initialState = {
	system: {},
	pubStreamId: null,
	screenStreamId: null,
	trialStreamId: null,
	isMicBtnOn: false,
	isCameraBtnOn: false,
	isScreenBtnOn: false,
	mics: {},
	cameras: {},
	speakers: {},
	selectedMicId: null,
	selectedCameraId: null,
	selectedSpeakerId: null,
	isDeviceAccessGranted: null,
};

const handleActions = handlers => (state = initialState, action) => {
	if (action.type in handlers) {
		return handlers[action.type](state, action.payload);
	}
	return state;
};

export default ({ actionTypes, broadcastActionTypes, videoActionTypes }) => handleActions({
	[broadcastActionTypes.BROADCAST_LEAVE]: state => ({
		...initialState,
		system: state.system,
		mics: state.mics,
		cameras: state.cameras,
		speakers: state.speakers,
		selectedMicId: state.selectedMicId,
		selectedCameraId: state.selectedCameraId,
		selectedSpeakerId: state.selectedSpeakerId,
		isDeviceAccessGranted: state.isDeviceAccessGranted,
	}),

	[actionTypes.MIC_SELECT]: (state, { id }) => {
		if (id in state.mics) {
			return {
				...state,
				selectedMicId: id,
			};
		}
		return state;
	},

	[actionTypes.CAMERA_SELECT]: (state, { id }) => {
		if (id in state.cameras) {
			return {
				...state,
				selectedCameraId: id,
			};
		}
		return state;
	},

	[actionTypes.SPEAKER_SELECT]: (state, { id }) => {
		if (id in state.speakers) {
			return {
				...state,
				selectedSpeakerId: id,
			};
		}
		return state;
	},

	[actionTypes.BTN_TOGGLE]: (state, { isMicBtnOn, isCameraBtnOn }) => ({
		...state,
		isMicBtnOn: isMicBtnOn !== undefined ? isMicBtnOn : state.isMicBtnOn,
		isCameraBtnOn: isCameraBtnOn !== undefined ? isCameraBtnOn : state.isCameraBtnOn,
	}),

	[videoActionTypes.STREAM_STARTED]: (state, {
		id,
		isPub,
		isTrial,
		isScreen,
		hasAudio,
		hasVideo,
		audioDeviceId,
		videoDeviceId,
	}) => {
		if (isPub) {
			if (isScreen) {
				return {
					...state,
					isScreenBtnOn: true,
					screenStreamId: id,
				};
			}

			const devices = {};

			if (hasAudio && audioDeviceId in state.mics) {
				devices.selectedMicId = audioDeviceId;
			}
			if (hasVideo && videoDeviceId in state.cameras) {
				devices.selectedCameraId = videoDeviceId;
			}

			if (isTrial) {
				return {
					...state,
					...devices,
					trialStreamId: id,
				};
			}
			return {
				...state,
				...devices,
				pubStreamId: id,
				isMicBtnOn: hasAudio,
				isCameraBtnOn: hasVideo,
			};
		}
		return state;
	},

	[videoActionTypes.STREAM_ENDED]: (state, { id }) => {
		if (id === state.pubStreamId) {
			return {
				...state,
				pubStreamId: null,
				isMicBtnOn: false,
				isCameraBtnOn: false,
			};
		}
		if (id === state.screenStreamId) {
			return {
				...state,
				screenStreamId: null,
				isScreenBtnOn: false,
			};
		}
		if (id === state.trialStreamId) {
			return {
				...state,
				trialStreamId: null,
			};
		}
		return state;
	},

	[videoActionTypes.SYSTEM_REPORT]: (state, { system }) => ({
		...state,
		system,
	}),

	[videoActionTypes.DEVICES_UPDATE]: (state, payload) => {
		const { selectedMicId, selectedCameraId, selectedSpeakerId } = state;
		const { audioDevices, videoDevices, audioOutputDevices } = payload;

		const newState = {
			...state,
			mics: audioDevices,
			cameras: videoDevices,
			speakers: audioOutputDevices,
			isDeviceAccessGranted: payload.isAccessGranted,
		};

		if (!selectedMicId || !(selectedMicId in audioDevices)) {
			newState.selectedMicId = payload.defaultAudioDeviceId;
		}
		if (!selectedCameraId || !(selectedCameraId in videoDevices)) {
			newState.selectedCameraId = payload.defaultVideoDeviceId;
		}
		if (!selectedSpeakerId || !(selectedSpeakerId in audioOutputDevices)) {
			newState.selectedSpeakerId = payload.defaultAudioOutputDeviceId;
		}
		return newState;
	},
});


// Selectors
const selectors = {};
Object.keys(initialState).forEach((key) => {
	selectors[key] = state => state.publish[key];
});


// Reselect
export const Selectors = createSelector => ({
	...selectors,
	mics: createSelector(
		[selectors.mics],
		devices => Object.values(devices),
	),
	cameras: createSelector(
		[selectors.cameras],
		devices => Object.values(devices),
	),
	speakers: createSelector(
		[selectors.speakers],
		devices => Object.values(devices),
	),
	isScreenEnabled: createSelector(
		[selectors.system],
		system => system.isScreenEnabled,
	),
	isScreenBrowser: createSelector(
		[selectors.system],
		system => system.isScreenBrowser,
	),
	isScreenBrowserUpdateRequired: createSelector(
		[selectors.system],
		system => system.isScreenBrowserUpdateRequired,
	),
	isScreenExtensionRequired: createSelector(
		[selectors.system],
		system => system.isScreenExtensionRequired,
	),
});
