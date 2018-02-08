const initialState = {
	isAuth: null,
	username: null,
	email: null,
	about: null,
	avatarSrc: null,
	coverSrc: null,
	channels: [],
	pay: {},
	usernameInput: '',
	usernameInputFeedback: '',
	channelInput: '',
	channelInputFeedback: '',
	isLoginModalOpen: false,
	isChannelModalOpen: false,
	signupToken: null,
	isUserAvatarUploading: false,
	isUserCoverUploading: false,
	isChannelAvatarUploading: false,
	isChannelCoverUploading: false,
};


export default actionTypes => (
	(state = initialState, { type, payload }) => {
		switch (type) {
			// Broadcast actions
			case actionTypes.AUTH:
				return state;

			case actionTypes.AUTH_SUCCESS:
				return {
					...state,
					isAuth: payload.isAuth,
					username: payload.username,
					email: payload.email,
					about: payload.about,
					avatarSrc: payload.avatarSrc,
					coverSrc: payload.coverSrc,
					channels: payload.channels || [],
					pay: payload.pay || {},
				};

			case actionTypes.USERNAME_INPUT_CHANGE:
				return {
					...state,
					usernameInput: payload.value,
				};

			case actionTypes.USERNAME_INPUT_FEEDBACK:
				return {
					...state,
					usernameInputFeedback: payload.message,
				};

			case actionTypes.CHANNEL_MODAL_TOGGLE:
				return {
					...state,
					isChannelModalOpen: payload.isOpen,
				};

			case actionTypes.CHANNEL_INPUT_CHANGE:
				return {
					...state,
					channelInput: payload.value,
				};

			case actionTypes.CHANNEL_INPUT_FEEDBACK:
				return {
					...state,
					channelInputFeedback: payload.message,
				};

			case actionTypes.CREATE_CHANNEL_SUCCESS:
				return {
					...state,
					channelInput: '',
					channelInputFeedback: '',
					isChannelModalOpen: false,
				};

			case actionTypes.LOGIN_MODAL_TOGGLE:
				return {
					...state,
					isLoginModalOpen: payload.isOpen,
					// Delete the signup token when the modal is closed
					...(!payload.isOpen && state.signupToken && { signupToken: null }),
				};

			case actionTypes.SIGNUP_TOKEN_RECEIVED:
				return {
					...state,
					isLoginModalOpen: true,
					signupToken: payload.signupToken,
				};

			case actionTypes.USER_AVATAR_UPLOAD:
				return {
					...state,
					isUserAvatarUploading: true,
				};

			case actionTypes.USER_COVER_UPLOAD:
				return {
					...state,
					isUserCoverUploading: true,
				};

			case actionTypes.CHANNEL_AVATAR_UPLOAD:
				return {
					...state,
					isChannelAvatarUploading: true,
				};

			case actionTypes.CHANNEL_COVER_UPLOAD:
				return {
					...state,
					isChannelCoverUploading: true,
				};

			case actionTypes.IMG_UPLOAD_SUCCESS:
				return {
					...state,
					isUserAvatarUploading: false,
					isUserCoverUploading: false,
					isChannelAvatarUploading: false,
					isChannelCoverUploading: false,
				};

			case actionTypes.IMG_UPLOAD_FAIL:
				return {
					...state,
					isUserAvatarUploading: false,
					isUserCoverUploading: false,
					isChannelAvatarUploading: false,
					isChannelCoverUploading: false,
				};

			default:
				return state;
		}
	}
);


// Selectors
const selectors = {};
Object.keys(initialState).forEach((key) => {
	selectors[key] = state => state.user[key];
});


// Reselect
export const Selectors = createSelector => ({
	...selectors,
	shoudPromptForUsername: createSelector(
		[selectors.isAuth, selectors.username],
		(isAuth, username) => isAuth && !username,
	),
	authHeaderMenu: createSelector(
		[selectors.username, selectors.avatarSrc, selectors.channels],
		(username, avatarSrc, channels) => ([
			{
				title: username,
				img: avatarSrc,
				link: [
					{
						title: 'My Profile',
						link: `/${username}`,
					},
					{
						title: 'My Channels',
						link: channels.map(
							({ name }) => ({ title: name, link: `/${username}/${name}` }),
						),
					},
					{
						title: 'Settings',
						link: '/settings',
					},
					{
						title: 'Logout',
						link: '/api/logout',
					},
				],
			},
		]),
	),
	isPayApproved: createSelector(
		[selectors.pay],
		pay => pay.isApproved,
	),
	hasAppliedForPay: createSelector(
		[selectors.pay],
		pay => pay.hasApplied,
	),
});
