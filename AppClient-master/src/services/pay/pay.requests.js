export default (request, BASE_API_PATH) => ({
	payWithStripe: body => request({
		body,
		method: 'POST',
		uri: `${BASE_API_PATH}/pay/stripe`,
	}),
});
