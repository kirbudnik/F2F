export default (request, BASE_API_PATH) => ({
	getBubble: ({ broadcastId, clientId }) => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}/bubble/${clientId}`,
	}),
	setBubble: ({ broadcastId, clientId, hasAudio, hasVideo, imgSrc }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}/bubble/${clientId}`,
		body: { hasAudio, hasVideo, imgSrc },
	}),
	deleteBubble: ({ broadcastId, clientId }) => request({
		method: 'DELETE',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}/bubble/${clientId}`,
	}),
});
