import Rollbar from 'rollbar';

const options = {
	accessToken: process.env.ROLLBAR_CLIENT_TOKEN,
	enabled: true,
	captureUncaught: true,
	handleUncaughtExceptions: true,
	handleUnhandledRejections: true,
	payload: {
		environment: process.env.ENVIRONMENT,
		client: {
			javascript: {
				source_map_enabled: true,
				code_version: process.env.CODE_SHA,
				// Optionally have Rollbar guess which frames the error was thrown from
				// when the browser does not provide line and column numbers.
				guess_uncaught_frames: true,
			},
		},
		server: {
			host: window.location.host,
		},
	},
};

const rollbar = new Rollbar(options);

export default rollbar;
