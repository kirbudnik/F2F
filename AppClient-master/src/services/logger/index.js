import { DEBUG } from 'constants/index';

export default {
	log(...args) {
		if (DEBUG) {
			// eslint-disable-next-line no-console
			console.log('Logger', ...args);
		}
	},
	error(...args) {
		if (DEBUG) {
			// eslint-disable-next-line no-console
			console.error('Logger', ...args);
		}
	},
};
