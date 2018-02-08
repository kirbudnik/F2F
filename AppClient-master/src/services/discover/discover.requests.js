export default (request, BASE_API_PATH) => ({
	load: () => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/discover`,
	}),
});
