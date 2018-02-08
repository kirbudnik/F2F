const create = type => payload => ({ type, payload });

export const actionTypes = {
	LOAD_DATA: 'settings/load_data',
	LOAD_DATA_SUCCESS: 'settings/load_data_success',
	LOAD_DATA_FAIL: 'settings/load_data_fail',

	LOAD_ERROR_CLEAR: 'settings/clear_error',

	OPEN_LOGIN_MODAL: 'settings/open_login_modal',

	SAVE_DATA: 'settings/save_data',
	SAVE_DATA_SUCCESS: 'settings/save_data_success',

	FIELD_CHANGE: 'settings/change_field',

	STRIPE_LINK: 'settings/stripe/link',
	STRIPE_UNLINK: 'settings/stripe/unlink',

	PAY_APPLIED: 'settings/pay/applied',
};

export default {
	loadData: create(actionTypes.LOAD_DATA),
	loadDataSuccess: create(actionTypes.LOAD_DATA_SUCCESS),
	loadDataFail: create(actionTypes.LOAD_DATA_FAIL),
	clearLoadingError: create(actionTypes.LOAD_ERROR_CLEAR),

	openLoginModal: create(actionTypes.OPEN_LOGIN_MODAL),

	saveData: create(actionTypes.SAVE_DATA),
	saveDataSuccess: create(actionTypes.SAVE_DATA_SUCCESS),

	changeField: create(actionTypes.FIELD_CHANGE),

	linkStripe: create(actionTypes.STRIPE_LINK),
	unlinkStripe: create(actionTypes.STRIPE_UNLINK),

	appliedForPay: create(actionTypes.PAY_APPLIED),
};
