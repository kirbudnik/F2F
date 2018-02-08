export default ({
	Observable,
	url,
	ga,
	logger,
	constants,
	selectors,
	actionTypes,
	actions,
	location,
	pageActions,
	notificationActions,
	requests,
	history,
	popupWindow,
	expBackoff,
	cookies,
	window,
}) => {
	const {
		MIN_USERNAME_LEN,
		MAX_USERNAME_LEN,
		MAX_CHANNEL_NAME_LEN,
		MAX_IMG_FILE_SIZE,
	} = constants;

	const isValidImgFile = file => (
		file instanceof Object &&
		file.name && file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) &&
		file.size < MAX_IMG_FILE_SIZE
	);

	const stop = () => false;

	const obsOf = action => Observable.of(action);

	const multipleEmits = (...emits) =>
		Observable.merge(...emits.map(obsOf));

	function reqErrName(err) {
		return err.statusCode === 0 ? 'REQUEST_TIMEOUT' : 'SERVER_ERROR';
	}

	const logLoginEvent = (action, label) => ga.event({
		category: 'login',
		action,
		...(label && { label }),
	});


	// Pull our own user data
	const authStatus = action$ =>
		action$
			.ofType(actionTypes.AUTH)
			.switchMap(() =>
				expBackoff({
					promise: () => requests.auth(),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 6,
				})
				.map(resp => actions.authSuccess({ ...resp.body }))
				.catch((err) => {
					logger.error(err);
					return multipleEmits(
						actions.authFail(),
						notificationActions.addMsg({ name: reqErrName(err) }),
					);
				}),
			);


	const logModalOpenEvents = action$ =>
		action$
			.ofType(actionTypes.LOGIN_MODAL_TOGGLE)
			.filter(action => action.payload.isOpen)
			.do(() => logLoginEvent('loginModalOpen'))
			.filter(stop);


	const logNoOauthAccounts = action$ =>
		action$
			.ofType(actionTypes.LOGIN_NO_OAUTH_ACCOUNTS)
			.do(() => logLoginEvent('oauthNoAccounts'))
			.filter(stop);


	// Open a window to login with oauth
	const loginHandler = (action$, store) =>
		action$
			.ofType(actionTypes.LOGIN)
			.filter(() => !selectors.isAuth(store.getState()))
			.pluck('payload', 'platform')
			.do(platform => logLoginEvent('oauthLoginClick', platform))
			.switchMap(platform =>
				popupWindow({
					windowName: 'f2fLogin',
					getRedirectUrl:
						expBackoff({
							promise: () => requests.getLoginRedirect(platform),
							retryWhen: err => err.statusCode >= 500,
							initialDelay: 200,
							maxRetries: 3,
						})
						.pluck('body', 'redirectUrl'),
					endUrl: 'state=login.',
				})
				.filter(() => !selectors.isAuth(store.getState()))
				.filter((href) => {
					if (href.indexOf('error=') !== -1) {
						logLoginEvent('oauthLoginCancelled', platform);
						return false;
					}
					return true;
				})
				.map(href => url.parse(href, true).query)
				.mergeMap(({ code, state }) =>
					expBackoff({
						promise: () => requests.login({ platform, code, state }),
						retryWhen: err => err.statusCode >= 500,
						initialDelay: 200,
						maxRetries: 2,
					})
					.do(() => logLoginEvent('oauthLoginSuccess', platform))
					.pluck('body', 'signupToken')
					.map((signupToken) => {
						if (signupToken) {
							// New user. Needs to choose a username
							logLoginEvent('oauthSignup', platform);
							return actions.receivedSignupToken({ signupToken });
						}
						// Existing user. Reload the page.
						window.location.reload();
						return null;
					})
					.filter(emit => emit)
					.catch((err) => {
						logger.error(err);
						if (err.statusCode === 401) {
							// User is already logged in. Perhaps from another tab.
							window.location.reload();
							return Observable.empty();
						}
						if (err.statusCode === 409) {
							return multipleEmits(
								notificationActions.addMsg({ name: 'LOGIN_PERMISSIONS_DENIED' }),
								actions.toggleLoginModal({ isOpen: false }),
							);
						}
						return multipleEmits(
							notificationActions.addMsg({ name: 'LOGIN_FAILED' }),
							actions.toggleLoginModal({ isOpen: false }),
						);
					}),
				)
				.catch((err) => {
					logger.error(err);
					if (err.statusCode === 401) {
						// User is already logged in. Perhaps from another tab.
						window.location.reload();
						return Observable.empty();
					}
					return multipleEmits(
						notificationActions.addMsg({ name: reqErrName(err) }),
						actions.toggleLoginModal({ isOpen: false }),
					);
				}),
			);


	const startsWithAlphaNum = str => (/^[a-zA-Z0-9]/).test(str);
	const invalidUsernameChar = str => str.replace(/[-_a-zA-Z0-9]+/, '').charAt(0);

	const isValidUsername = username => (
		typeof username === 'string' &&
		username.length >= MIN_USERNAME_LEN &&
		username.length <= MAX_USERNAME_LEN &&
		(/^[a-zA-Z0-9][-_a-zA-Z0-9]+$/).test(username)
	);

	const giveUsernameFeedback = message => actions.usernameInputFeedback({ message });
	const usernameFeedback = {
		empty: () => giveUsernameFeedback(null),
		firstChar: () => giveUsernameFeedback('Please start with a letter or number'),
		invalidChar: char => giveUsernameFeedback(`Username cannot contain '${char}'`),
		tooLong: () => giveUsernameFeedback('That\'s a bit too long'),
		unavailable: () => giveUsernameFeedback('Username is unavailable'),
		invalidToken: () => giveUsernameFeedback('Your session expired. Please login again'),
		error: () => giveUsernameFeedback('Unable to connect. Just a moment...'),
	};

	// Give feedback when username is invalid. Clear feedback if username is empty.
	// We cannot say a username is valid until server has validated it.
	const localUsernameValidation = action$ =>
		action$
			.ofType(actionTypes.USERNAME_INPUT_CHANGE)
			.map(action => action.payload.value)
			.debounceTime(400)
			.distinctUntilChanged()
			.map((username) => {
				if (username === '') {
					return usernameFeedback.empty();
				} else if (!isValidUsername(username)) {
					if (invalidUsernameChar(username)) {
						return usernameFeedback.invalidChar(invalidUsernameChar(username));
					}
					if (!startsWithAlphaNum(username)) {
						return usernameFeedback.firstChar();
					}
					if (username.length >= MAX_USERNAME_LEN) {
						return usernameFeedback.tooLong();
					}
					return usernameFeedback.unavailable(username);
				}
				return null;
			})
			.filter(action => action);


	// Only hit the server is username is valid
	const serverUsernameValidation = action$ =>
		action$
			.ofType(actionTypes.USERNAME_INPUT_CHANGE)
			.map(action => action.payload.value)
			.debounceTime(400)
			.distinctUntilChanged()
			.filter(username => isValidUsername(username))
			.switchMap(username =>
				expBackoff({
					promise: () => requests.usernameAvailability(username),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 3,
				})
				.map(resp => resp.body.isAvailable)
				.map((isAvailable) => {
					if (isAvailable) {
						return usernameFeedback.empty();
					}
					return usernameFeedback.unavailable();
				})
				.catch((err) => {
					logger.error(err);
					return obsOf(usernameFeedback.error());
				}),
			);

	const handleUsernameSubmit = (action$, store) =>
		action$
			.ofType(actionTypes.USERNAME_INPUT_SUBMIT)
			.map(() => {
				const state = store.getState();
				const username = selectors.usernameInput(state);
				const signupToken = selectors.signupToken(state);
				if (!isValidUsername(username) || !signupToken) {
					return null;
				}
				return { username, signupToken };
			})
			.filter(args => args !== null)
			.mergeMap(({ username, signupToken }) =>
				expBackoff({
					promise: () => requests.setUsername({ username, signupToken }),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 3,
				})
				.do(() => ga.event({
					category: 'login',
					action: 'usernameSet',
				}))
				.filter(() => {
					window.location.reload();
					return false;
				})
				.catch((err) => {
					logger.error(err);
					if (err.statusCode >= 500) {
						return obsOf(usernameFeedback.error());
					}
					if (err.statusCode === 409) {
						return obsOf(usernameFeedback.unavailable());
					}
					if (err.statusCode === 403) {
						return obsOf(usernameFeedback.invalidToken());
					}
					return obsOf(usernameFeedback.unavailable());
				}),
			);


	const isValidChannelName = name => (
		typeof name === 'string' &&
		name.length > 0 &&
		name.length <= MAX_CHANNEL_NAME_LEN &&
		(/^[-_a-zA-Z0-9]+$/).test(name) &&
		(/^[a-zA-Z0-9]/).test(name)
	);

	const invalidChannelChar = str => str.replace(/[-_a-zA-Z0-9]+/, '').charAt(0);

	const giveChannelFeedback = message => actions.channelInputFeedback({ message });
	const channelFeedback = {
		empty: () => giveChannelFeedback(null),
		invalid: () => giveChannelFeedback('Invalid name'),
		exists: () => giveChannelFeedback('You\'ve already got this channel'),
		tooMany: () => giveChannelFeedback('You\'ve got too many channels'),
		firstChar: () => giveChannelFeedback('Please start with a letter or number'),
		invalidChar: char => giveChannelFeedback(`Channel name cannot contain '${char}'`),
		tooLong: () => giveChannelFeedback('That\'s a bit too long'),
		error: () => giveChannelFeedback('Unable to connect. Just a moment...'),
	};

	const handleChannelInputChange = action$ =>
		action$
			.ofType(actionTypes.CHANNEL_INPUT_CHANGE)
			.map(action => action.payload.value)
			.distinctUntilChanged()
			.map((value) => {
				if (isValidChannelName(value) || value === '') {
					return channelFeedback.empty();
				}
				if (invalidChannelChar(value)) {
					return channelFeedback.invalidChar(invalidChannelChar(value));
				}
				if (!startsWithAlphaNum(value)) {
					return channelFeedback.firstChar();
				}
				if (value.length >= MAX_CHANNEL_NAME_LEN) {
					return channelFeedback.tooLong();
				}
				return channelFeedback.invalid();
			});

	const handleChannelInputSubmit = (action$, store) =>
		action$
			.ofType(actionTypes.CHANNEL_INPUT_SUBMIT)
			.map(() => {
				const state = store.getState();
				const username = selectors.username(state);
				const channelName = selectors.channelInput(state);
				if (!username || !isValidChannelName(channelName)) {
					return null;
				}
				return { username, channelName };
			})
			.filter(args => args !== null)
			.mergeMap(({ username, channelName }) =>
				expBackoff({
					promise: () => requests.createChannel({ username, channelName }),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 3,
				})
				.map(() => actions.createChannelSuccess({ username, channelName }))
				.catch((err) => {
					logger.error(err);
					if (err.statusCode >= 500) {
						return obsOf(channelFeedback.error());
					}
					if (err.statusCode === 409) {
						return obsOf(channelFeedback.exists());
					}
					if (err.statusCode === 402) {
						return obsOf(channelFeedback.tooMany());
					}
					return obsOf(channelFeedback.invalid());
				}),
			);

	// Re-pull our user data after creating a channel
	const authAfterCreateChannel = action$ =>
		action$
			.ofType(actionTypes.CREATE_CHANNEL_SUCCESS)
			.pluck('payload')
			.mergeMap(({ username }) => Observable.merge(
				obsOf(actions.auth()),
				obsOf(pageActions.loadPage({ username })),
			));


	const uploadImg = (request, start) => (action$, store) =>
		start(action$, store)
			.filter(({ file }) => isValidImgFile(file))
			.map(({ ...args, file }) => {
				const username = selectors.username(store.getState());
				const formData = new FormData();

				formData.append('file', file);
				return { ...args, formData, username };
			})
			.filter(args => args.username)
			.mergeMap(args =>
				expBackoff({
					promise: () => request(args),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 3,
				})
				.pluck('body')
				.mergeMap(body => multipleEmits(
					pageActions.updatePageContent(body),
					actions.imgUploadSuccess(),
				))
				.catch((err) => {
					logger.error(err);
					return multipleEmits(
						actions.imgUploadFailed(),
						notificationActions.addMsg({ name: 'IMG_UPLOAD_FAILED' }),
					);
				}),
			);

	const uploadUserAvatar = uploadImg(
		requests.uploadUserAvatar,
		action$ => action$
			.ofType(actionTypes.USER_AVATAR_UPLOAD)
			.pluck('payload'),
	);

	const uploadUserCover = uploadImg(
		requests.uploadUserCover,
		action$ => action$
			.ofType(actionTypes.USER_COVER_UPLOAD)
			.pluck('payload'),
	);

	const uploadChannelAvatar = uploadImg(
		requests.uploadChannelAvatar,
		action$ => action$
			.ofType(actionTypes.CHANNEL_AVATAR_UPLOAD)
			.pluck('payload'),
	);

	const uploadChannelCover = uploadImg(
		requests.uploadChannelCover,
		action$ => action$
			.ofType(actionTypes.CHANNEL_COVER_UPLOAD)
			.pluck('payload'),
	);

	const saveAbout = (request, start) => (action$, store) =>
		start(action$, store)
			.map(args => ({
				...args,
				username: selectors.username(store.getState()),
			}))
			.filter(args => args.username)
			.mergeMap(args =>
				expBackoff({
					promise: () => request(args),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 6,
				})
				.pluck('body')
				.map(body => pageActions.updatePageContent(body))
				.catch((err) => {
					logger.error(err);
					return obsOf(notificationActions.addMsg({ name: 'SAVE_TEXT_FAILED' }));
				}),
			);

	const saveUserAbout = saveAbout(
		requests.saveUserAbout,
		action$ => action$
			.ofType(actionTypes.USER_ABOUT_SAVE)
			.pluck('payload')
			.map(args => ({ text: args.value })),
	);

	const saveChannelAbout = saveAbout(
		requests.saveChannelAbout,
		action$ => action$
			.ofType(actionTypes.CHANNEL_ABOUT_SAVE)
			.pluck('payload')
			.map(args => ({ ...args, text: args.value })),
	);


	const saveReferrer = action$ =>
		action$
			.first()
			.do(() => {
				const cookie = cookies.get('referralUrl');
				if (!cookie) {
					cookies.set({
						name: 'referralUrl',
						value: `${location.href}`,
						exp: 30 * 24 * 60 * 60,
					});
				}
			})
			.filter(stop);

	const deleteChannel = (action$, store) =>
		action$
			.ofType(actionTypes.CHANNEL_DELETE)
			.pluck('payload', 'channelName')
			.map(channelName => ({
				channelName,
				username: selectors.username(store.getState()),
			}))
			.filter(args => args.username)
			.mergeMap(args =>
				expBackoff({
					promise: () => requests.deleteChannel(args),
					retryWhen: err => err.statusCode >= 500,
					initialDelay: 200,
					maxRetries: 3,
				})
				.do(() => history.push(`/${args.username}`))
				.map(() => actions.auth())
				.catch((err) => {
					logger.error(err);
					return obsOf(notificationActions.addMsg({ name: 'DELETE_CHANNEL_FAILED' }));
				}),
			);

	return {
		authStatus,
		logModalOpenEvents,
		logNoOauthAccounts,
		loginHandler,
		localUsernameValidation,
		serverUsernameValidation,
		handleUsernameSubmit,
		handleChannelInputChange,
		handleChannelInputSubmit,
		authAfterCreateChannel,
		uploadUserAvatar,
		uploadUserCover,
		uploadChannelAvatar,
		uploadChannelCover,
		saveUserAbout,
		saveChannelAbout,
		saveReferrer,
		deleteChannel,
	};
};
