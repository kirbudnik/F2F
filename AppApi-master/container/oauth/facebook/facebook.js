const GET_CODE = 'https://www.facebook.com/v2.8/dialog/oauth';


// Facebook submission process:
// https://developers.facebook.com/docs/facebook-login/review/how-to-submit
module.exports = ({ joi, config, oauthHelpers, requests }) => {
	const { CLIENT_ID, REDIRECT_URL } = config.facebook;
	const { urlString, now } = oauthHelpers;

	// Generate a url query string to send the user to facebook for Oauth confirmation
	const redirectUrl = ({ isPublisher, state }) =>
		urlString({
			url: GET_CODE,
			params: {
				state,
				response_type: 'code',
				// Need other unique permissions to stream to an event or group
				// https://developers.facebook.com/docs/videos/live-video/getting-started
				scope: isPublisher ?
					'public_profile,email,publish_actions' :
					'public_profile,email',
				client_id: CLIENT_ID,
				redirect_uri: REDIRECT_URL,
				// rerequest will ask for permissions again next time the user logs in
				// if they haven't yet granted permission to everything requested
				auth_type: 'rerequest',
			},
		});

	const tokenResp = joi.object().keys({
		access_token: joi.string().required(),
		expires_in: joi.number().integer().positive().required(),
	});

	const permissionResp = joi.object().keys({
		data: joi.array().items(
			joi.object().keys({
				permission: joi.string().required(),
				status: joi.string().required(),
			}),
		).required(),
	});

	const userResp = joi.object().keys({
		id: joi.string().required(),
		email: joi.string().required(),
		name: joi.string().required(),
		first_name: joi.string().required(),
	});

	const exchangeCodeForToken = code =>
		requests.codeForToken(code)
			.then(body => tokenResp.validate(body, { allowUnknown: true }))
			.then(({ access_token: accessToken, expires_in: expiresIn }) =>
				requests.getPermissions(accessToken)
					.then(body => permissionResp.validate(body, { allowUnknown: true }))
					.then(body => body.data.find(dict => dict.permission === 'email'))
					.then((emailPermission) => {
						if (!emailPermission || emailPermission.status !== 'granted') {
							throw new Error('PermissionsDenied');
						}
						return requests.user(accessToken);
					})
					.then(user => userResp.validate(user, { allowUnknown: true }))
					.then(({ id, email, name, first_name: firstName }) => ({
						name,
						firstName,
						email,
						accessToken,
						platformId: id,
						emailVerified: true,
						accessTokenExp: now() + expiresIn,
					})),
			)
			.catch((err) => {
				// TODO - Handle specific error types and display custom messages
				throw err;
			});


	const streamKeyResp = joi.object().keys({
		stream_url: joi.string().required(),
		// body.id is the video id and could be used to pull values like viewer count
	});

	const streamKey = (accessToken, platformId) =>
		requests.streamKey(accessToken, platformId)
			.then(body => streamKeyResp.validate(body, { allowUnknown: true }))
			.then(body => body.stream_url)
			.catch((err) => {
				throw err;
			});

	return {
		redirectUrl,
		exchangeCodeForToken,
		streamKey,
	};
};
