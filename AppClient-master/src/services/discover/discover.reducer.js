const initialState = {
	isLoading: false,
	isLoadingError: false,
	isOpen: false,
	loadedAt: 0,
	channels: [],
};


export default types => (
	(state = initialState, { type, payload }) => {
		switch (type) {
			case types.LOAD:
				return {
					...state,
					isLoading: true,
					isLoadingError: false,
				};

			case types.LOAD_FAIL:
				return {
					...state,
					isLoading: false,
					isLoadingError: true,
				};

			case types.LOAD_SUCCESS:
				return {
					...state,
					isLoading: false,
					loadedAt: payload.loadedAt,
					channels: payload.channels.map(channel => ({
						...channel,
						link: `/${channel.username}/${channel.channelName}`,
					})),
				};

			case types.TOGGLE_DISCOVER: {
				return {
					...state,
					isOpen: payload && 'isOpen' in payload ? payload.isOpen : !state.isOpen,
				};
			}

			default:
				return state;
		}
	}
);


// Selectors
const selectors = {};
Object.keys(initialState).forEach((key) => {
	selectors[key] = state => state.discover[key];
});


// Reselect
export const Selectors = () => ({
	...selectors,
});
