export default (request, BASE_API_PATH) => ({
	getRestreamRedirect: platform => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/restream/${platform}`,
	}),
	getRestreamKey: ({ platform, code, state }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/restream/${platform}`,
		body: { platform, code, state },
	}),
});
