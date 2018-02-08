const create = type => payload => ({ type, payload });

export const actionTypes = {
	LOAD_ATTEMPT: 'discover/load/attempt',
	LOAD: 'discover/load',
	LOAD_SUCCESS: 'discover/load/success',
	LOAD_FAIL: 'discover/load/fail',

	TOGGLE_DISCOVER: 'discover/toggle',

	CHANNEL_CLICK: 'discover/channel/click',
};

export default {
	loadAttempt: create(actionTypes.LOAD_ATTEMPT),
	load: create(actionTypes.LOAD),
	loadSuccess: create(actionTypes.LOAD_SUCCESS),
	loadFail: create(actionTypes.LOAD_FAIL),

	toggleDiscover: create(actionTypes.TOGGLE_DISCOVER),

	channelClick: create(actionTypes.CHANNEL_CLICK),
};
