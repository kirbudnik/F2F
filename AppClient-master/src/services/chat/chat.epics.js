function randomAlphanumeric(len) {
	const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const setLength = charSet.length;
	let str = '';
	for (let i = 0; i < len; i += 1) {
		str += charSet.charAt(Math.floor(Math.random() * setLength));
	}
	return str;
}

function parseJsonDict(json) {
	try {
		const dict = JSON.parse(json);
		return dict instanceof Object ? dict : {};
	} catch (err) {
		return {};
	}
}

export default ({
	Observable,
	combineEpics,
	localStorage,
	ga,
	logger,
	alerts,
	appMessageTypes,
	MAX_COMMENT_LEN,
	CHAT_COLOR,
	requests,
	expBackoff,
	actions,
	actionTypes,
	selectors,
	userActions,
	userActionTypes,
	userSelectors,
	broadcastActions,
	broadcastActionTypes,
	broadcastSelectors,
	videoActionTypes,
}) => {
	const multipleEmits = (...emits) =>
		Observable.merge(...emits.map(emit => Observable.of(emit)));

	const isValidChatText = text =>
		typeof text === 'string' &&
		text.length > 0 &&
		text.length <= MAX_COMMENT_LEN;

	const isValidCommentObj = comment =>
		comment instanceof Object &&
		typeof comment.id === 'string' &&
		typeof comment.username === 'string' &&
		typeof comment.color === 'string' &&
		isValidChatText(comment.text);


	const loginToChat = (action$, store) =>
		action$
			.ofType(actionTypes.SUBMIT_ATTEMPT)
			.map(() => store.getState())
			.filter(state => !userSelectors.isAuth(state))
			.map(state => ({
				text: selectors.input(state),
				broadcastId: broadcastSelectors.broadcastId(state),
			}))
			.do(args => localStorage.setItem('chatInput', JSON.stringify(args)))
			.map(() => userActions.toggleLoginModal({ isOpen: true }));


	const getInputAfterLogin = (action$, store) =>
		action$
			.ofType(videoActionTypes.ROOM_JOIN_SUCCESS)
			.map(() => broadcastSelectors.broadcastId(store.getState()))
			.map((curBroadcastId) => {
				const { text, broadcastId } = parseJsonDict(localStorage.getItem('chatInput'));
				localStorage.removeItem('chatInput');
				if (text && broadcastId && broadcastId === curBroadcastId) {
					return text;
				}
				return null;
			})
			.filter(value => value)
			.filter(() => userSelectors.isAuth(store.getState()))
			.map(value => actions.inputChange({ value }));


	const clearStorageWhenLoginModalCloses = action$ =>
		action$
			.ofType(userActionTypes.LOGIN_MODAL_TOGGLE)
			.pluck('payload', 'isOpen')
			.filter(isOpen => !isOpen)
			.filter(() => {
				localStorage.removeItem('chatInput');
				return false;
			});


	// Filter data then emit action to trigger server request
	const handleChatSubmit = (action$, store) =>
		action$
			.ofType(actionTypes.SUBMIT_ATTEMPT)
			.filter(() => userSelectors.isAuth(store.getState()))
			.map(() => {
				const state = store.getState();
				return {
					text: selectors.input(state),
					broadcastId: broadcastSelectors.broadcastId(state),
					color: CHAT_COLOR,
				};
			})
			.filter(args => isValidChatText(args.text))
			.map(args => actions.submit(args));

	// Data has already been filtered. Make the request to the server
	const submit = action$ =>
		action$
			.ofType(actionTypes.SUBMIT)
			.pluck('payload')
			.exhaustMap(args =>
				expBackoff({
					promise: () => requests.submitComment(args),
					retryWhen: err => err.statusCode >= 500,
					maxRetries: 3,
					initialDelay: 200,
				})
				.do(() => ga.event({
					category: 'chat',
					action: 'chatSent',
					label: 'success',
					value: args.text.length,
				}))
				.map(() => actions.submitSuccess())
				.takeUntil(action$.ofType(broadcastActionTypes.BROADCAST_LEAVE))
				.catch((err) => {
					logger.log(err);
					ga.event({
						category: 'chat',
						action: 'chatSent',
						label: 'failure',
						value: args.text.length,
					});
					return multipleEmits(
						broadcastActions.alert({ name: alerts.CHAT_SUBMIT_FAILED }),
						actions.submitFail(),
					);
				}),
			);


	const loadInitialComments = (action$, store) =>
		action$
			.ofType(videoActionTypes.ROOM_JOIN_SUCCESS)
			.map(() => broadcastSelectors.broadcastId(store.getState()))
			.filter(id => id)
			.switchMap(broadcastId =>
				expBackoff({
					promise: () => requests.loadComments(broadcastId),
					retryWhen: err => err.statusCode >= 500,
					maxRetries: 6,
					initialDelay: 200,
				})
				.pluck('body', 'comments')
				.filter(comments => Array.isArray(comments))
				.map(comments =>
					comments
						.filter(comment => isValidCommentObj(comment))
						.reverse(),
				)
				.map(comments => actions.appendComments({ comments }))
				.takeUntil(action$.ofType(broadcastActionTypes.BROADCAST_LEAVE))
				.catch((err) => {
					logger.error(err);
					// Fail silently
					return Observable.empty();
				}),
			);

	const onVideoAppMessage = msgType => action$ =>
		action$
			.ofType(videoActionTypes.APP_MESSAGE)
			.pluck('payload')
			.filter(payload => payload.type === msgType);

	// Pull chat messages from the video side
	const realtimeComments = action$ =>
		onVideoAppMessage(appMessageTypes.CHAT)(action$)
			.pluck('data')
			.filter(isValidCommentObj)
			.map(comment => actions.appendComment(comment));


	// F2FBot payment message
	const listenForPayments = (action$, store) =>
		onVideoAppMessage(appMessageTypes.PAY)(action$)
			.pluck('data')
			.filter(() => broadcastSelectors.isHost(store.getState()))
			.filter(args => Number.isInteger(args.amount))
			.map(({ amount, username }) => actions.appendComment({
				id: randomAlphanumeric(24),
				color: '#e5a54c',
				textColor: '#e5a54c',
				isBold: true,
				username: 'F2FBot',
				text: `Congratulations! ${username || 'An anonymous user'} just sent you USD$${parseFloat((amount / 100).toFixed(2))}`,
			}));


	return combineEpics(
		loginToChat,
		getInputAfterLogin,
		clearStorageWhenLoginModalCloses,
		handleChatSubmit,
		submit,
		loadInitialComments,
		realtimeComments,
		listenForPayments,
	);
};
