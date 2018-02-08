export default (request, BASE_API_PATH) => ({
	auth: () => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/users`,
	}),

	getLoginRedirect: platform => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/users/${platform}/login`,
	}),

	login: ({ platform, code, state }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/users/${platform}/login`,
		body: { platform, code, state },
	}),

	logout: () => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/logout`,
	}),

	usernameAvailability: username => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/users/${username}/availability`,
	}),

	setUsername: ({ username, signupToken }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/users`,
		body: { signupToken, username },
	}),

	createChannel: ({ username, channelName }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/users/${username}/channels`,
		body: { channelName },
	}),

	uploadUserAvatar: ({ formData, username }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/users/${username}/avatar`,
		body: formData,
		timeout: 60000,
	}),

	uploadUserCover: ({ formData, username }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/users/${username}/cover`,
		body: formData,
		timeout: 60000,
	}),

	uploadChannelAvatar: ({ formData, username, channelName }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/users/${username}/channels/${channelName}/avatar`,
		body: formData,
		timeout: 60000,
	}),

	uploadChannelCover: ({ formData, username, channelName }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/users/${username}/channels/${channelName}/cover`,
		body: formData,
		timeout: 60000,
	}),

	saveUserAbout: ({ text, username }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/users/${username}/about`,
		body: { text },
	}),

	saveChannelAbout: ({ text, username, channelName }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/users/${username}/channels/${channelName}/about`,
		body: { text },
	}),

	deleteChannel: ({ username, channelName }) => request({
		method: 'DELETE',
		uri: `${BASE_API_PATH}/users/${username}/channels/${channelName}`,
	}),
});
