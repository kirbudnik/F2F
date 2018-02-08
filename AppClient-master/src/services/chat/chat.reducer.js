const initialState = {
	comments: [],
	disabled: false,
	input: '',
	unreadComments: 0,
};


const handleActions = handlers => (state = initialState, action) => {
	if (action.type in handlers) {
		return handlers[action.type](state, action.payload);
	}
	return state;
};

export default ({
	actionTypes,
	broadcastActionTypes,
	MAX_COMMENTS_SAVED,
	MAX_COMMENT_LEN,
}) => handleActions({

	[broadcastActionTypes.BROADCAST_LEAVE]: () => initialState,

	[actionTypes.INPUT_CHANGE]: (state, { value }) => ({
		...state,
		input: value.length <= MAX_COMMENT_LEN ? value : value.substr(0, MAX_COMMENT_LEN),
	}),

	[actionTypes.SUBMIT]: state => ({
		...state,
		disabled: true,
	}),

	[actionTypes.SUBMIT_SUCCESS]: state => ({
		...state,
		input: '',
		disabled: false,
	}),

	[actionTypes.SUBMIT_FAIL]: state => ({
		...state,
		disabled: false,
	}),

	[actionTypes.COMMENTS_APPEND]: (state, { comments }) => {
		const len = state.comments.length + comments.length;

		return {
			...state,
			comments: [
				...state.comments,
				...comments,
			].slice(len > MAX_COMMENTS_SAVED ? len - MAX_COMMENTS_SAVED : 0),
			unreadComments: state.unreadComments + comments.length,
		};
	},

	[actionTypes.COMMENT_APPEND]: (state, comment) => ({
		...state,
		comments: [
			...state.comments,
			comment,
		].slice(state.comments.length >= MAX_COMMENTS_SAVED ? 1 : 0),
		unreadComments: state.unreadComments + 1,
	}),


	[actionTypes.COMMENTS_MARK_AS_READ]: state => ({
		...state,
		unreadComments: 0,
	}),
});


// Selectors
const selectors = {
	comments: state => state.chat.comments,
	disabled: state => state.chat.disabled,
	input: state => state.chat.input,
	unreadComments: state => state.chat.unreadComments,
};

// Reselect
export const Selectors = () => ({
	...selectors,
});
