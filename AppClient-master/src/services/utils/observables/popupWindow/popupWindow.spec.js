import 'rxjs';
import { test } from 'tape';
import EventEmitter from 'events';
import { Observable } from 'rxjs/Observable';
import PopupWindow from './popupWindow';


const getRedirectUrl = Observable.of('http://localhost');
const windowName = 'login';
const endUrl = 'http://localhost/redirected';


const noop = () => {};

const timeout = delay => new Promise(res => setTimeout(res, delay));

const Popup = () => {
	const popup = {
		closed: false,
		location: {
			href: '',
		},
		close() {
			popup.closed = true;
		},
	};

	return popup;
};

const Factory = overrides => PopupWindow({
	Observable,
	openWindow: () => Popup(),
	addEventListener: noop,
	removeEventListener: noop,
	options: {
		interval: 10,
	},
	...overrides,
});


test('Popup window', (t1) => {
	t1.test('initialization', (t) => {
		let name;

		const popup = Popup();
		const openWindow = (...args) => {
			name = args[1];
			return popup;
		};
		const popupWindow = Factory({ openWindow });

		Observable.of(1)
			.mergeMap(() => popupWindow({
				getRedirectUrl,
				windowName,
				endUrl,
			}))
			.subscribe();

		t.equal(name, windowName, 'openWindow called with the supplied name');
		t.end();

		popup.close();
	});

	t1.test('initialize then wait', async (t) => {
		let resolved = false;

		const popup = Popup();
		const openWindow = () => popup;
		const popupWindow = Factory({ openWindow });

		Observable.of(1)
			.mergeMap(() => popupWindow({
				getRedirectUrl,
				windowName,
				endUrl,
			}))
			.subscribe(() => {
				resolved = true;
			});

		await timeout(500);

		t.notOk(resolved, 'observable does not resolve');
		t.notOk(popup.closed, 'popup does not close');
		t.end();

		popup.close();
	});

	t1.test('on redirect to end url', async (t) => {
		let resolved = false;
		let completed = false;

		const popup = Popup();
		const openWindow = () => popup;
		const popupWindow = Factory({ openWindow });

		Observable.of(1)
			.mergeMap(() => popupWindow({
				getRedirectUrl,
				windowName,
				endUrl,
			}))
			.subscribe(
			() => {
				resolved = true;
			},
			noop,
			() => {
				completed = true;
			},
			);

		popup.location.href = endUrl;
		await timeout(500);

		t.ok(resolved, 'observable resolves');
		t.ok(completed, 'observable completes');
		t.ok(popup.closed, 'popup closes');
		t.end();
	});


	t1.test('upon receiving window message', async (t) => {
		let resolved = false;
		let completed = false;

		const popup = Popup();
		const openWindow = () => popup;
		const emitter = new EventEmitter();
		const addEventListener = emitter.on.bind(emitter);
		const removeEventListener = emitter.removeListener.bind(emitter);
		const popupWindow = Factory({ openWindow, addEventListener, removeEventListener });

		Observable.of(1)
			.mergeMap(() => popupWindow({
				getRedirectUrl,
				windowName,
				endUrl,
			}))
			.subscribe(
			() => {
				resolved = true;
			},
			noop,
			() => {
				completed = true;
			},
			);

		emitter.emit('message', { data: { command: 'f2fRedirect', href: endUrl } });
		await timeout(500);

		t.ok(resolved, 'observable resolves');
		t.ok(completed, 'observable completes');
		t.ok(popup.closed, 'popup closes');
		t.end();
	});

	t1.test('upon completion', async (t) => {
		let removed = false;

		const emitter = new EventEmitter();
		const addEventListener = emitter.on.bind(emitter);
		const removeEventListener = (...args) => {
			removed = true;
			emitter.removeListener(...args);
		};
		const popupWindow = Factory({ addEventListener, removeEventListener });

		Observable.of(1)
			.mergeMap(() => popupWindow({
				getRedirectUrl,
				windowName,
				endUrl,
			}))
			.subscribe();

		emitter.emit('message', { data: { command: 'f2fRedirect', href: endUrl } });
		await timeout(500);

		t.ok(removed, 'window event listener is removed');
		t.end();
	});

	t1.test('on successful redirect and multiple window message', async (t) => {
		let count = 0;

		const popup = Popup();
		const openWindow = () => popup;
		const emitter = new EventEmitter();
		const addEventListener = emitter.on.bind(emitter);
		const removeEventListener = emitter.removeListener.bind(emitter);
		const popupWindow = Factory({ openWindow, addEventListener, removeEventListener });

		Observable.of(1)
			.mergeMap(() => popupWindow({
				getRedirectUrl,
				windowName,
				endUrl,
			}))
			.subscribe(() => {
				count += 1;
			});

		popup.location.href = endUrl;
		emitter.emit('message', { data: { command: 'f2fRedirect', href: endUrl } });
		emitter.emit('message', { data: { command: 'f2fRedirect', href: endUrl } });
		await timeout(500);

		t.equal(count, 1, 'only resolves once');
		t.end();
	});


	t1.test('attempt to resolve after closing the popup', async (t) => {
		let resolved = false;
		let completed = false;

		const popup = Popup();
		const openWindow = () => popup;
		const emitter = new EventEmitter();
		const addEventListener = emitter.on.bind(emitter);
		const removeEventListener = emitter.removeListener.bind(emitter);
		const popupWindow = Factory({ openWindow, addEventListener, removeEventListener });

		Observable.of(1)
			.mergeMap(() => popupWindow({
				getRedirectUrl,
				windowName,
				endUrl,
			}))
			.subscribe(
			() => {
				resolved = true;
			},
			noop,
			() => {
				completed = true;
			},
			);

		popup.close();
		popup.location.href = endUrl;
		emitter.emit('message', { data: { command: 'f2fRedirect', href: endUrl } });
		await timeout(500);

		t.notOk(resolved, 'observable does not resolve');
		t.ok(completed, 'observable completes');
		t.end();
	});

	t1.test('error', (t) => {
		let error;

		const popupWindow = Factory();

		Observable.of(1)
			.mergeMap(() => popupWindow({
				getRedirectUrl: Observable.throw('MyError'),
				windowName,
				endUrl,
			}))
			.catch((err) => {
				error = err;
				return Observable.empty();
			})
			.subscribe();

		t.equal(error, 'MyError', 'propogates to the caller');
		t.end();
	});
});
