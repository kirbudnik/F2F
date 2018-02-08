const create = type => payload => ({ type, payload });

export const actionTypes = {
	ENABLE: 'chat/enable',

	INPUT_CHANGE: 'chat/input',

	SUBMIT_ATTEMPT: 'chat/submit/attempt',
	SUBMIT: 'chat/submit',
	SUBMIT_SUCCESS: 'chat/submit/success',
	SUBMIT_FAIL: 'chat/submit/fail',

	COMMENTS_APPEND: 'chat/comments/append',
	COMMENT_APPEND: 'chat/comment/append',
	COMMENTS_MARK_AS_READ: 'chat/comments/mark_as_read',
};

export default {
	enableChat: create(actionTypes.ENABLE),

	inputChange: create(actionTypes.INPUT_CHANGE),

	submitAttempt: create(actionTypes.SUBMIT_ATTEMPT),
	submit: create(actionTypes.SUBMIT),
	submitSuccess: create(actionTypes.SUBMIT_SUCCESS),
	submitFail: create(actionTypes.SUBMIT_FAIL),

	appendComments: create(actionTypes.COMMENTS_APPEND),
	appendComment: create(actionTypes.COMMENT_APPEND),
	markAsRead: create(actionTypes.COMMENTS_MARK_AS_READ),
};
