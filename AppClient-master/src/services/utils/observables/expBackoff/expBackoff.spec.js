import 'rxjs';
import { test } from 'tape';
import { Observable } from 'rxjs/Observable';
import expBackoff from './index';


// Sample promise. Tell it which attempt you would like it to succeed on
const succeedOn = (on) => {
	let attempts = 0;

	return () => new Promise((resolve, reject) => {
		attempts += 1;
		if (attempts >= on) {
			resolve('success');
		} else {
			reject('error');
		}
	});
};


test('Exponential backoff', (t1) => {
	t1.test('succeeds after several failures', (t) => {
		const source = Observable.of(1, 2)
			.switchMap(() =>
				expBackoff({
					promise: succeedOn(3),
					maxRetries: 2,
				}),
			);

		source.subscribe((val) => {
			t.ok(val, 'success');
			t.end();
		});
	});

	t1.test('throws err after exceeding max retries', (t) => {
		const source = Observable.of(1)
			.switchMap(() =>
				expBackoff({
					promise: succeedOn(4),
					maxRetries: 2,
				}),
			);

		source.subscribe(null, (err) => {
			t.equal(err, 'error');
			t.end();
		});
	});

	t1.test('does not retry when retryWhen returns false', (t) => {
		const source = Observable.of(1)
			.switchMap(() =>
				expBackoff({
					promise: succeedOn(3),
					maxRetries: 2,
					retryWhen: () => false,
				}),
			);

		source.subscribe(null, (err) => {
			t.equal(err, 'error');
			t.end();
		});
	});
});
