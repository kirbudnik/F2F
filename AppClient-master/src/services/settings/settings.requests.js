export default (request, BASE_API_PATH) => ({
	getPage: ({ page, uri }) => request({
		method: 'GET',
		// @todo keep all settings API in one way
		uri: uri ? `${BASE_API_PATH}/${uri}` : `${BASE_API_PATH}/settings/${page}`,
	}),
	toggleSettings: ({ page, settings }) => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/settings/${page}`,
		body: settings,
	}),
	getStripeRedirectUrl: () => request({
		method: 'GET',
		uri: `${BASE_API_PATH}/settings/pay/stripe`,
	}),
	linkStripe: body => request({
		body,
		method: 'POST',
		uri: `${BASE_API_PATH}/settings/pay/stripe`,
	}),
	unlinkStripe: () => request({
		method: 'DELETE',
		uri: `${BASE_API_PATH}/settings/pay/stripe`,
	}),
	appliedForPay: () => request({
		method: 'POST',
		uri: `${BASE_API_PATH}/settings/pay/applied`,
	}),
});
