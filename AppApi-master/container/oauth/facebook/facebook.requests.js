const TOKEN = 'https://graph.facebook.com/v2.8/oauth/access_token';
const PERMISSIONS = 'https://graph.facebook.com/v2.8/me/permissions';
const USER = 'https://graph.facebook.com/v2.8/me?fields=email,name,first_name,picture';
const STREAM = ['https://graph.facebook.com/v2.8/', '/live_videos'];


module.exports = ({ request, helpers, config }) => {
	const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = config.facebook;
	const { appSecretProof } = helpers;

	const codeForToken = code => request({
		method: 'GET',
		json: true,
		uri: TOKEN,
		timeout: 5000,
		qs: {
			code,
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			redirect_uri: REDIRECT_URL,
		},
	});

	const getPermissions = accessToken => request({
		method: 'GET',
		json: true,
		uri: PERMISSIONS,
		timeout: 5000,
		qs: {
			access_token: accessToken,
			appsecret_proof: appSecretProof(accessToken, CLIENT_SECRET),
		},
	});

	const user = accessToken => request({
		method: 'GET',
		json: true,
		uri: USER,
		timeout: 5000,
		qs: {
			access_token: accessToken,
			appsecret_proof: appSecretProof(accessToken, CLIENT_SECRET),
		},
	});

	const streamKey = (accessToken, platformId) => request({
		method: 'POST',
		json: true,
		uri: STREAM[0] + platformId + STREAM[1],
		timeout: 5000,
		form: { access_token: accessToken },
	});

	return {
		codeForToken,
		getPermissions,
		user,
		streamKey,
	};
};
