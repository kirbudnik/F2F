export default (request, BASE_API_PATH) => ({
	closeTip: tipId => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/onboard/${tipId}/close`,
	}),
});
