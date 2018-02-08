// const request = require("../../request");
// const helpers = require("../helpers");
// const wrap = helpers.wrap;


// const TWITCH_API_ROOT = 'https://api.twitch.tv/kraken';
// const urls = {
// 	AUTH: `${TWITCH_API_ROOT}/oauth2/authorize`,
// 	TOKEN: `${TWITCH_API_ROOT}/oauth2/token`,
// 	USER: `${TWITCH_API_ROOT}/user`,
// 	CHANNEL: `${TWITCH_API_ROOT}/channel`,
// 	INJEST: 'rtmp://live-jfk.twitch.tv/app/',
// }


// class TwitchStrategy {
// 	constructor(client) {
// 		this.client = client;
// 	}

// 	// Generate a url query string to send the user to twitch for Oauth confirmation
// 	getRedirectUrl(data) {
// 		return helpers.urlString(urls.AUTH, redirectParams(data, this.client));
// 	}

// 	// User has returned from twitch with a code. Use it to get an access token and user data
// 	async login(data) {
// 		let err, accessToken, expiresIn, oauthData;

// 		[ err, { accessToken, expiresIn } ] = await wrap(tokenRequest(data, this.client));
// 		if(err) throw err;

// 		[ err, oauthData ] = await wrap(userRequest(accessToken, expiresIn, this.client));
// 		if(err) throw err;

// 		return oauthData;
// 	}
// }
// module.exports = TwitchStrategy;


// // Helpers
// function redirectParams(data, client) {
// 	return {
// 		response_type: 'code',
// 		scope: "user_read" + (data.isPublisher ? "+channel_read" : ""),
// 		state: data.state,
// Force user to log in every time. Allows users to switch
// account even when persistently logged into twitch
// 		force_verify: true,
// 		client_id: client.ID,
// 		redirect_uri: client.REDIRECT_URL,
// 	}
// }

// async function tokenRequest(data, client) {
// 	let params = {
// 		grant_type: 'authorization_code',
// 		code: data.code,
// Twitch asks for state to be passed in on this request as well
// 		state: data.state,
// 		client_id: client.ID,
// 		client_secret: client.SECRET,
// 		redirect_uri: client.REDIRECT_URL,
// 	};
// 	let [ err, body ] = await wrap(request.post({url: urls.TOKEN, form: params}));
// 	if(err) throw err;

// 	const { access_token: accessToken, scope } = body;
// 	if(accessToken == null || scope == null) {
// 		throw new Error("Couldn't get an access token from Twitch");
// 	}
// 	return accessToken;
// }

// async function userRequest(accessToken) {
// 	let [ err, body ] = await wrap(request.get({url: urls.USER, form: {oauth_token: accessToken}}));
// 	if(err) throw err;

// 	const { _id: platformId, display_name: name, email } = body;
// 	if(platformId == null) {
// 		throw new Error("Unable to obtain user data from Twitch");
// 	}
// 	return {
// 		platformId,
// 		email,
// 		emailVerified: email ? true : false, 	// Twitch will not return an email if it is not verified
// 		accessToken,
// 		expiresIn: -1,							// Twitch access tokens don't expire
// 	};
// }

