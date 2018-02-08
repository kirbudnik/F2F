const TOKEN = 'https://www.googleapis.com/oauth2/v4/token';
const BROADCAST = 'https://www.googleapis.com/youtube/v3/liveBroadcasts';
const STREAM = 'https://www.googleapis.com/youtube/v3/liveStreams';


module.exports = ({ request, config }) => {
	const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = config.google;

	const codeForToken = code => request({
		method: 'POST',
		uri: TOKEN,
		json: true,
		timeout: 5000,
		form: {
			code,
			grant_type: 'authorization_code',
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			// Any registered redirect url (security measure)
			redirect_uri: REDIRECT_URL,
		},
	});

	const refreshAccessToken = refreshToken => request({
		method: 'POST',
		json: true,
		uri: TOKEN,
		timeout: 5000,
		form: {
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			redirect_uri: REDIRECT_URL,
		},
	});

	const broadcastDetails = accessToken => request({
		method: 'GET',
		json: true,
		uri: BROADCAST,
		timeout: 5000,
		qs: {
			part: 'contentDetails',			// 'contentDetails' to grab the stream id
			mine: true,
			broadcastType: 'persistent',
			access_token: accessToken,
		},
	});

	const streamKey = ({ boundStreamId, accessToken }) => request({
		method: 'GET',
		json: true,
		uri: STREAM,
		timeout: 5000,
		qs: {
			part: 'id, snippet, cdn',
			id: boundStreamId,
			access_token: accessToken,
		},
	});

	return {
		codeForToken,
		refreshAccessToken,
		broadcastDetails,
		streamKey,
	};
};
