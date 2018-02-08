const initialState = {
	tips: {
		shareLink: false,
	},
};


const handleActions = handlers => (state = initialState, action) => {
	if (action.type in handlers) {
		return handlers[action.type](state, action.payload);
	}
	return state;
};

export default actionTypes => handleActions({
	[actionTypes.TIPS_LOADED]: (state, tips) => ({
		...state,
		tips,
	}),
	[actionTypes.TIP_CLOSE]: (state, { tipId }) => ({
		...state,
		tips: {
			...state.tips,
			[tipId]: false,
		},
	}),
});


// Selectors
const selectors = {
	tips: state => state.onboard.tips,
};

// Reselect
export const Selectors = () => ({
	...selectors,
});
