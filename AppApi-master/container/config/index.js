const { RESTRICTED_USERNAMES, VULGAR_NAMES } = require('./restrictedNames');
const RANDOM_NAMES = require('./randomNames');

const NODE_ENV = process.env.NODE_ENV;
const DEBUG = NODE_ENV === 'development';
const SITE_URL = process.env.SITE_URL;
const JWT_EXP = 30 * 24 * 60 * 60;


// FIXME - This is insecure and only for temporarily talking to videonginx locally
if (DEBUG) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

module.exports = (assert) => {
	const config = {
		RESTRICTED_USERNAMES,
		VULGAR_NAMES,
		RANDOM_NAMES,
		DEBUG,
		SITE_URL,
		JWT_EXP,

		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
		OAUTH_STATE_SECRET: process.env.OAUTH_STATE_SECRET,

		SIGNUP_TOKEN_EXP: 24 * 60 * 60,
		SIGNUP_TOKEN_SECRET: process.env.SIGNUP_TOKEN_SECRET,

		// FIXME - This is temp for initial set up.
		// We should always use prod video stack once we have deployed it.
		ENVIRONMENT: process.env.ENVIRONMENT,
		VIDEO_BASE_URL: process.env.VIDEO_BASE_URL || 'https://video.f2f.live',
		F2F_APP_ID: process.env.F2F_APP_ID,
		F2F_APP_SECRET: process.env.F2F_APP_SECRET,
		F2F_TOKEN_EXP: 7 * 24 * 60 * 60,

		S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
		S3_BUCKET_PATH: `https://${process.env.S3_BUCKET_NAME}.nyc3.digitaloceanspaces.com`,

		// Urls
		ERROR_URL: `${SITE_URL}/error`,
		YOUTUBE_DOCS_URL: `${SITE_URL}/docs/youtube`,

		MIN_USERNAME_LEN: 5,
		MAX_USERNAME_LEN: 24,
		MAX_CHANNEL_NAME_LEN: 24,
		MAX_UNLISTED_BROADCAST_NAME_LEN: 24,
		MAX_ABOUT_LEN: 10000,
		MAX_CHAT_TEXT_LEN: 255,
		MAX_PAY_BTN_TEXT_LEN: 10,
		MAX_PAY_DESC_TEXT_LEN: 100,
		MIN_PAY_AMOUNT: 100, // $1 USD
		MAX_PAY_AMOUNT: 100 * 10000, // $10,000 USD

		MAX_DISCOVERABLES: 30,

		LAYOUTS: [
			'solo',
			'news',
			'host',
			'group',
			'screen',
			'presentation',
		],
		DEFAULT_LAYOUT: 'group',

		f2fRoles: {
			MODERATOR: 'moderator',
			PUBLISHER: 'publisher',
			STUDENT: 'student',
			VIEWER: 'viewer',
		},
		JWT_COOKIE_SETTINGS: {
			secure: true,
			maxAge: JWT_EXP * 1000, // Milliseconds
			httpOnly: true, // Only the server can access the jwt
		},
		CSRF_COOKIE_SETTINGS: {
			secure: true,
			maxAge: JWT_EXP * 1000, // Milliseconds
		},
		LOGIN_PLATFORMS: [
			'google',
			'facebook',
		],
		RESTREAM_PLATFORMS: [
			'youtube',
			'facebook',
		],
		google: {
			CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
			CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
			REDIRECT_URL: `${SITE_URL}/redirect`,
		},
		facebook: {
			CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
			CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
			REDIRECT_URL: `${SITE_URL}/redirect`,
		},
		// twitch: {
		// 	CLIENT_ID: process.env.TWITCH_CLIENT_ID,
		// 	CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
		// 	REDIRECT_URL: `${SITE_URL}/redirect`,
		// },
		stripe: {
			CLIENT_ID: process.env.STRIPE_CLIENT_ID,
			SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		},
		INFUSIONSOFT: {
			API_KEY: process.env.INFUSIONSOFT_API_KEY,
			APP_NAME: process.env.INFUSIONSOFT_APP_NAME,
			ACTIVE_GROUP: 108,
			CONFIRMED_GROUP: 110,
			BROADCASTER_GROUP: 112,
			BROADCAST_STARTED_GROUP: 114,
		},
	};


	// NODE_ENV can only be production or development.
	// ENVIRONMENT describes the specific environment.
	const NODE_ENVS = ['production', 'development'];
	const ENVIRONMENTS = ['production', 'staging', 'development'];

	assert(NODE_ENVS.includes(NODE_ENV), 'Config - NODE_ENV is invalid');
	assert(ENVIRONMENTS.includes(config.ENVIRONMENT), 'Config - ENVIRONMENT is invalid');
	assert(config.SITE_URL, 'Config - SITE_URL is required');
	assert(config.JWT_SECRET_KEY, 'Config - JWT_SECRET_KEY is required');
	assert(config.OAUTH_STATE_SECRET, 'Config - OAUTH_STATE_SECRET is required');
	assert(config.SIGNUP_TOKEN_SECRET, 'Config - SIGNUP_TOKEN_SECRET is required');
	assert(config.S3_BUCKET_NAME, 'Config - S3_BUCKET_NAME is required');

	assert(config.F2F_APP_ID, 'Config - F2F_APP_ID is required');
	assert(config.F2F_APP_SECRET, 'Config - F2F_APP_SECRET is required');

	assert(config.google.CLIENT_ID, 'Config - GOOGLE_CLIENT_ID is required');
	assert(config.google.CLIENT_SECRET, 'Config - GOOGLE_CLIENT_SECRET is required');

	assert(config.facebook.CLIENT_ID, 'Config - FACEBOOK_CLIENT_ID is required');
	assert(config.facebook.CLIENT_SECRET, 'Config - FACEBOOK_CLIENT_SECRET is required');

	// assert(config.twitch.CLIENT_ID, 'Config - TWITCH_CLIENT_ID is required');
	// assert(config.twitch.CLIENT_SECRET, 'Config - TWITCH_CLIENT_SECRET is required');

	assert(config.stripe.CLIENT_ID, 'Config - STRIPE_CLIENT_ID is required');
	assert(config.stripe.SECRET_KEY, 'Config - STRIPE_SECRET_KEY is required');

	assert(config.INFUSIONSOFT.API_KEY, 'Config - INFUSIONSOFT_API_KEY is required');
	assert(config.INFUSIONSOFT.APP_NAME, 'Config - INFUSIONSOFT_APP_NAME is required');

	return config;
};
