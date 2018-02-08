const keyStates = {
	ON: 'on',
	OFF: 'off',
	LOADING: 'loading',
};

const initialState = {
	youtubeState: keyStates.OFF,
	youtubeRestreamKey: null,
};


const handleActions = handlers => (state = initialState, action) => {
	if (action.type in handlers) {
		return handlers[action.type](state, action.payload);
	}
	return state;
};

export default ({ actionTypes, broadcastActionTypes, videoActionTypes }) => handleActions({
	[broadcastActionTypes.BROADCAST_LEAVE]: () => initialState,

	[actionTypes.YOUTUBE_SET_KEY]: (state, payload) => ({
		...state,
		youtubeRestreamKey: payload.key,
		youtubeState: keyStates.LOADING,
	}),

	[actionTypes.YOUTUBE_REMOVE_KEY]: state => ({
		...state,
		youtubeRestreamKey: null,
		youtubeState: keyStates.OFF,
	}),

	[videoActionTypes.RESTREAM_ADD_KEY_SUCCESS]: (state, { key }) => {
		if (key === state.youtubeRestreamKey) {
			return {
				...state,
				youtubeState: keyStates.ON,
			};
		}
		return state;
	},

	[videoActionTypes.RESTREAM_ADD_KEY_FAILURE]: (state, { key }) => {
		if (key === state.youtubeRestreamKey) {
			return {
				...state,
				youtubeRestreamKey: null,
				youtubeState: keyStates.OFF,
			};
		}
		return state;
	},
});


// Selectors
const selectors = {};
Object.keys(initialState).forEach((key) => {
	selectors[key] = state => state.restream[key];
});


// Reselect
export const Selectors = createSelector => ({
	youtubeRestreamKey: selectors.youtubeRestreamKey,
	hasYoutubeKey: createSelector(
		[selectors.youtubeRestreamKey],
		key => key !== null,
	),
	isYoutubeLive: createSelector(
		[selectors.youtubeState],
		state => state === keyStates.ON || state === keyStates.LOADING,
	),
});
