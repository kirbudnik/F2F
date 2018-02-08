const create = type => payload => ({ type, payload });

export const actionTypes = {
	TIPS_LOADED: 'onboard/tips/loaded',
	TIP_CLOSE: 'onboard/tip/close',
};

export default {
	tipsLoaded: create(actionTypes.TIPS_LOADED),
	closeTip: create(actionTypes.TIP_CLOSE),
};
