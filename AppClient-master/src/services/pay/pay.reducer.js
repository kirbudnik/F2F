const initialState = {
	status: null,
};

const handleActions = handlers => (state = initialState, action) => {
	if (action.type in handlers) {
		return handlers[action.type](state, action.payload);
	}
	return state;
};

export default actionTypes => handleActions({
	[actionTypes.STRIPE_PAY]: state => ({
		...state,
		status: 'loading',
	}),
	[actionTypes.PAY_SUCCESS]: state => ({
		...state,
		status: 'success',
	}),
	[actionTypes.PAY_FAILED]: state => ({
		...state,
		status: null,
	}),
	[actionTypes.CLEAR_STATUS]: state => ({
		...state,
		status: null,
	}),
});


// Selectors
const selectors = {};
Object.keys(initialState).forEach((key) => {
	selectors[key] = state => state.pay[key];
});


// Reselect
export const Selectors = () => ({
	...selectors,
});
