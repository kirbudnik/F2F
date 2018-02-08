const initialState = {
	isLoading: false,
	isLoadingError: false,
	isSaving: false,
	accountDetails: {
		aboutMe: '',
	},
	pay: {
		isApproved: false,
		hasApplied: false,
		isStripeConnected: false,
		btnColor: '#ffffff',
		btnText: '',
		descriptionText: '',
		isCustomAmountOn: true,
		presetAmounts: [],
		btnLocations: {
			channel: true,
			profile: true,
			broadcast: true,
		},
	},
	payments: [],
};

export default actionTypes => (
	(state = initialState, { type, payload }) => {
		switch (type) {
			case actionTypes.LOAD_DATA:
				return {
					...state,
					isLoading: true,
					isLoadingError: false,
				};

			case actionTypes.LOAD_DATA_SUCCESS:
				return {
					...state,
					...payload.body,
					isLoading: false,
				};

			case actionTypes.LOAD_DATA_FAIL:
				return {
					...state,
					isLoading: false,
					isLoadingError: true,
				};

			case actionTypes.LOAD_ERROR_CLEAR:
				return {
					...state,
					isLoadingError: false,
				};

			case actionTypes.SAVE_DATA:
				return {
					...state,
					isSaving: true,
				};

			case actionTypes.SAVE_DATA_SUCCESS:
				return {
					...state,
					isSaving: false,
				};

			case actionTypes.FIELD_CHANGE:
				return {
					...state,
					[payload.page]: {
						...state[payload.page],
						[payload.field]: payload.value,
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
	selectors[key] = state => state.settings[key];
});


// Reselect
export const Selectors = () => ({
	...selectors,
});
