const create = type => payload => ({ type, payload });

export const actionTypes = {
	ADD_MSG: 'notification/add_msg',
	CLOSE_MSG: 'notification/close_msg',
	CLOSE_ALL: 'notification/close_all',
};

export default {
	addMsg: create(actionTypes.ADD_MSG),
	closeMsg: create(actionTypes.CLOSE_MSG),
	closeAll: create(actionTypes.CLOSE_ALL),
};
