export default (request, BASE_API_PATH) => ({
	createBroadcast: ({ channelName, isUnlisted, broadcastName }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/broadcasts`,
		body: { channelName, isUnlisted, broadcastName },
	}),

	joinBroadcast: broadcastId => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}/join`,
	}),

	getBroadcast: broadcastId => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}`,
	}),

	endBroadcast: broadcastId => request({
		method: 'DELETE',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}`,
	}),

	goLive: broadcastId => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}/live`,
	}),

	setLayout: (broadcastId, layout) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}/layout`,
		body: { layout },
	}),

	keepAlive: broadcastId => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}/keepalive`,
	}),

	changeSettings: (broadcastId, settings) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/broadcasts/${broadcastId}/settings`,
		body: { settings },
	}),
});
