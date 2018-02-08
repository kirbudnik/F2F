import { Observable } from 'rxjs/Observable';


const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_MAX_DELAY = 2000;
const DEFAULT_INITIAL_DELAY = 100;
const DEFAULT_MULTIPLIER = 2;


function validatePromise(func) {
	if (typeof func !== 'function') {
		throw new Error('ExpBackoff: \'promise\' must be a function');
	}
	return func;
}

function validateRetryWhen(func) {
	if (typeof func !== 'function') {
		return () => true;
	}
	return func;
}

function validateMaxRetries(retries) {
	if (Number.isInteger(retries) && retries >= 0) {
		return retries;
	}
	return DEFAULT_MAX_RETRIES;
}

function validateMaxDelay(delay) {
	if (Number.isInteger(delay) && delay > 0) {
		return delay;
	}
	return DEFAULT_MAX_DELAY;
}

function validateInitialDelay(delay) {
	if (Number.isInteger(delay) && delay > 0) {
		return delay;
	}
	return DEFAULT_INITIAL_DELAY;
}

function validateMultiplier(mult) {
	if (Number.isInteger(mult) && mult >= 1) {
		return mult;
	}
	return DEFAULT_MULTIPLIER;
}


function source(args) {
	const promise = validatePromise(args.promise);
	const retryWhen = validateRetryWhen(args.retryWhen);
	const maxRetries = validateMaxRetries(args.maxRetries);
	const maxDelay = validateMaxDelay(args.maxDelay);
	const initialDelay = validateInitialDelay(args.initialDelay);
	const multiplier = validateMultiplier(args.multiplier);

	const delay = retryAttempt =>
		// eslint-disable-next-line no-restricted-properties
		Math.min(initialDelay * Math.pow(multiplier, (retryAttempt - 1)), maxDelay);


	return Observable
		.defer(() => promise())
		.retryWhen((errors) => {
			let retryAttempt = 0;

			return errors
				.mergeMap((err) => {
					retryAttempt += 1;

					if (retryWhen(err) && retryAttempt <= maxRetries) {
						return Observable.of(err);
					}
					return Observable.throw(err);
				})
				.delayWhen(() => Observable.timer(delay(retryAttempt)));
		});
}

export default source;

