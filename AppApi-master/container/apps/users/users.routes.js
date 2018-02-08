const avatarSize = 400;
const coverWidth = 1920;
const coverAspect = 5.8;

module.exports = ({ express, middleware, controller }) => {
	const {
		isAnon,
		isSelf,
		hasValidCookies,
		channelExists,
		uploadImage,
	} = middleware;
	const {
		auth,
		getUser,
		getChannel,
		getLoginRedirect,
		login,
		usernameAvailability,
		setUserAbout,
		setChannelAbout,
		uploadUserAvatar,
		uploadUserCover,
		uploadChannelAvatar,
		uploadChannelCover,
		setUsername,
		createChannel,
		deleteChannel,
	} = controller;

	const uploadAvatar = uploadImage(avatarSize, avatarSize);
	const uploadCover = uploadImage(coverWidth, coverWidth / coverAspect);

	const router = express.Router();

	router
		// Get
		.get('/', auth)
		.get('/:username', getUser)
		.get('/:username/channels/:channelName', getChannel)
		.use(hasValidCookies)
		.get('/:platform/login', isAnon, getLoginRedirect)
		.post('/:platform/login', isAnon, login)
		.get('/:username/availability', isAnon, usernameAvailability)

		// Set
		.post('/', isAnon, setUsername)
		.post('/:username/about', isSelf, setUserAbout)
		.post('/:username/avatar', isSelf, uploadAvatar, uploadUserAvatar)
		.post('/:username/cover', isSelf, uploadCover, uploadUserCover)
		.post('/:username/channels', isSelf, createChannel)
		.post('/:username/channels/:channelName/about', isSelf, channelExists, setChannelAbout)
		.post('/:username/channels/:channelName/avatar', isSelf, channelExists, uploadAvatar, uploadChannelAvatar)
		.post('/:username/channels/:channelName/cover', isSelf, channelExists, uploadCover, uploadChannelCover)
		.delete('/:username/channels/:channelName', isSelf, deleteChannel);

	return router;
};
