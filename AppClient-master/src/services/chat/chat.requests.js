export default (request, BASE_API_PATH) => ({
	submitComment: ({ broadcastId, ...args }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}/chat`,
		body: args,
	}),

	loadComments: broadcastId => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}/chat`,
	}),
});
