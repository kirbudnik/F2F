module.exports = (request, config) => {
	const {
		VIDEO_BASE_URL,
		F2F_APP_ID: appId,
		F2F_APP_SECRET: appSecret,
	} = config;

	return {
		createRoom: () => (
			request({
				method: 'POST',
				uri: `${VIDEO_BASE_URL}/api/room`,
				json: true,
				timeout: 5000,
				form: { appId, appSecret },
			})
		),
		// destroyRoom: roomId => (
		// 	request({
		// 		method: 'DELETE',
		// 		uri: `${VIDEO_BASE_URL}/api/room/${roomId}`,
		// 		json: true,
		// 		timeout: 5000,
		// 		form: { appId, appSecret },
		// 	})
		// ),
		pingRoom: roomId => (
			request({
				method: 'GET',
				uri: `${VIDEO_BASE_URL}/api/room/${roomId}/ping`,
				json: true,
				timeout: 5000,
				form: { appId, appSecret },
			})
		),
		roomMessage: (roomId, message) => (
			request({
				method: 'POST',
				uri: `${VIDEO_BASE_URL}/api/room/${roomId}/message`,
				json: true,
				timeout: 5000,
				form: { message, appId, appSecret },
			})
		),
	};
};
