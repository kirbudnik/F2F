const initialState = {
	messages: [],
};

export default actionTypes => (
	(state = initialState, { type, payload }) => {
		switch (type) {
			case actionTypes.ADD_MSG:
				return {
					...state,
					messages: [
						...state.messages.filter(({ name }) => name !== payload.name),
						payload,
					],
				};

			case actionTypes.CLOSE_MSG:
				return {
					...state,
					messages: state.messages.filter(({ name }) => name !== payload.name),
				};

			case actionTypes.CLOSE_ALL:
				return initialState;

			default:
				return state;
		}
	}
);


// Selectors
const selectors = {};
Object.keys(initialState).forEach((key) => {
	selectors[key] = state => state.notification[key];
});


// Reselect
export const Selectors = () => ({
	...selectors,
});
