const initialState = {
	is404: null,
	isLoadingError: null,
	content: {},
};


export default types => (
	(state = initialState, { type, payload }) => {
		switch (type) {
			case types.LOAD_PAGE:
				return initialState;

			case types.LOAD_PAGE_FAIL:
				return { ...state, isLoadingError: true };

			case types.LOAD_PAGE_404:
				return { ...state, is404: true };

			case types.LOAD_PAGE_SUCCESS:
				return {
					...state,
					content: payload,
				};

			case types.UPDATE_PAGE_CONTENT:
				return {
					...state,
					content: {
						...state.content,
						...payload,
					},
				};

			default:
				return state;
		}
	}
);


// Selectors
const selectors = {};
Object.keys(initialState).forEach((key) => {
	selectors[key] = state => state.page[key];
});


// Reselect
export const Selectors = createSelector => ({
	...selectors,
	hasContentLoaded: createSelector(
		[selectors.content],
		content => Object.keys(content).length > 0,
	),
	avatarSrc: createSelector(
		[selectors.content],
		content => content.avatarSrc,
	),
	payButton: createSelector(
		[selectors.content],
		(content) => {
			if (content.owner instanceof Object) {
				return content.owner.pay;
			}
			return content.pay;
		},
	),
});
