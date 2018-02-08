const GET_CODE = 'https://accounts.google.com/o/oauth2/v2/auth';


module.exports = ({ atob, joi, requests, oauthHelpers, config }) => {
	const { CLIENT_ID, REDIRECT_URL } = config.google;
	const { urlString, now } = oauthHelpers;


	const tokenSchema = joi.object().keys({
		// Google will return your client id as the aud parameter
		aud: joi.string().required().valid(CLIENT_ID),
		iss: joi.string().required().valid(['accounts.google.com', 'https://accounts.google.com']),
		sub: joi.string().required(),
		email: joi.string().required(),
		email_verified: joi.boolean().required(),
		name: joi.string().required(),
		given_name: joi.string(),
		picture: joi.string(),
	});

	// The idToken is an OpenID jwt received from Google.
	function decodeGoogleIdToken(idToken) {
		let claims;

		try {
			claims = JSON.parse(atob(idToken.split('.')[1]));
		} catch (err) {
			throw new Error('Invalid id token from Google');
		}

		return tokenSchema.validate(claims, { stripUnknown: true })
			.then(() => ({
				platformId: claims.sub,
				email: claims.email,
				emailVerified: claims.email_verified,
				name: claims.name,
				firstName: claims.given_name,
				picture: claims.picture,
			}));
	}

	// Generate a url query string to send the user to facebook for Oauth confirmation
	const redirectUrl = ({ isPublisher, state }) =>
		urlString({
			url: GET_CODE,
			params: {
				state,
				response_type: 'code',
				prompt: 'select_account', // Force the user to select which account to use
				// approval_prompt: 'force', // Ask for permissions. Always returns a refresh token
				access_type: isPublisher ? 'offline' : 'online',
				scope: isPublisher ?
					'https://www.googleapis.com/auth/youtube.readonly openid email profile' :
					'openid email profile',
				client_id: CLIENT_ID,
				redirect_uri: REDIRECT_URL,
			},
		});


	const tokenResp = joi.object().keys({
		id_token: joi.string().required(),
		access_token: joi.string().required(),
		refresh_token: joi.string(),
		expires_in: joi.number().required(),
	});

	// User has returned from youtube with a code. Use it to get an access token
	// The response may or may not contain a refresh token. Google has a limit
	// on the number of refresh tokens that will be returned for a given user on
	// a given app.
	const exchangeCodeForToken = code =>
		requests.codeForToken(code)
			.then(body => tokenResp.validate(body, { stripUnknown: true }))
			.then(body => decodeGoogleIdToken(body.id_token)
				.then(decoded => ({
					...decoded,
					...(body.refresh_token && { refreshToken: body.refresh_token }),
					accessToken: body.access_token,
					accessTokenExp: now() + body.expires_in,
				})),
			);

	// Use the access token to get a stream key from youtube
	// This will be in the format 'rtmp://...'
	// Simply need to forward to this url in order to stream to their youtube account
	function streamKey(accessToken) {
		// Get the user's YouTube stream id
		return requests.broadcastDetails(accessToken)
			.then((body) => {
				const { boundStreamId } = body.items[0].contentDetails;
				return requests.streamKey({ accessToken, boundStreamId });
			})
			.then((body) => {
				const { ingestionAddress, streamName } = body.items[0].cdn.ingestionInfo;
				return `${ingestionAddress}/${streamName}`;
			});
	}

	return {
		redirectUrl,
		exchangeCodeForToken,
		streamKey,
	};
};


/*
// May need this soon...

// Called before making api requests
// Check to see how long until the access token expires
// Refresh when required
async function ensureFreshToken(accessToken, refreshToken, exp) {
	// 30 mins
	if (exp - helpers.nowAsNumber() > 1800) {
		return { accessToken, exp };
	}
	if (refreshToken == null) {
		throw new Error('noRefreshToken');
	}

	const [err, body] = await wrap(request({
		method: 'POST',
		json: true,
		uri: urls.TOKEN,
		formData: {
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: google.CLIENT_ID,
			client_secret: google.CLIENT_SECRET,
			redirect_uri: google.REDIRECT_URL,
		},
	}));
	if (err) throw googHelpers.extractReasonFromError(err);
	if (typeof body !== 'object') {
		throw new Error('Google refresh token didn\'t return data');
	}
	if (body.access_token == null || body.expires_in == null) {
		throw new Error('insufficientDataReturned');
	}

	return {
		accessToken: body.access_token,
		exp: helpers.convertExpiresInToDate(body.expires_in),
	};
}
*/
