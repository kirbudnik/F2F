export default (request, BASE_API_PATH) => ({
	getPage: ({ username, channelName }) => request({
		method: 'GET',
		uri: channelName
			? `${BASE_API_PATH}/users/${username}/channels/${channelName}`
			: `${BASE_API_PATH}/users/${username}`,
	}),
});
