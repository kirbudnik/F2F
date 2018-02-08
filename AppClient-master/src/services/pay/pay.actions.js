const create = type => payload => ({ type, payload });

export const actionTypes = {
	STRIPE_MODAL_OPENED: 'pay/stripe/modal/opened',
	STRIPE_MODAL_CLOSED: 'pay/stripe/modal/closed',
	STRIPE_PAY: 'pay/stripe/pay',
	PAY_SUCCESS: 'pay/success',
	PAY_FAILED: 'pay/failed',
	CLEAR_STATUS: 'pay/clear_status',
};

export default {
	stripeModalOpened: create(actionTypes.STRIPE_MODAL_OPENED),
	stripeModalClosed: create(actionTypes.STRIPE_MODAL_CLOSED),
	payWithStripe: create(actionTypes.STRIPE_PAY),
	paySuccess: create(actionTypes.PAY_SUCCESS),
	payFailed: create(actionTypes.PAY_FAILED),
	clearStatus: create(actionTypes.CLEAR_STATUS),
};
