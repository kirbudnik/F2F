import 'rxjs';
import { test } from 'tape';
import configureMockStore from 'redux-mock-store';
import { Observable } from 'rxjs/Observable';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import actions, { actionTypes } from './video.actions';
import Epics from './video.epics';

const DELAY = 10;

// Helpers
const logger = {
	// eslint-disable-next-line no-console
	error: (...args) => console.error(...args),
};

const noop = () => {};

function wait(cb) {
	setTimeout(cb, DELAY + 1);
}
const waitPromise = () => new Promise((resolve) => {
	wait(resolve);
});

const getType = action => action.type;


function newStore(f2f) {
	const epics = Epics({
		Observable,
		actions,
		actionTypes,
		f2f,
		logger,
		options: {},
	});

	const epicMiddleware = createEpicMiddleware(combineEpics(...Object.values(epics)));
	const mockStore = configureMockStore([epicMiddleware]);
	return mockStore();
}


const mockF2f = () => {
	let idIncr = 0;
	const rooms = {};

	function newStreamId() {
		idIncr += 1;
		return idIncr - 1;
	}

	const StreamFactory = (id, isTrial) => ({
		on: noop,
		off: noop,
		attachVideoElement: noop,
		bitrate: noop,
		configure: noop,
		placement: noop,
		getStats: noop,
		unpublish: noop,
		getState: () => ({
			id,
			isTrial,
			isPub: true,
		}),
	});

	return {
		scanForDevices(callback) {
			callback(null, {});
		},
		systemReport() {
			return {};
		},
		room(roomId, token, roomCallback) {
			setTimeout(() => {
				const streams = {};
				const events = {};

				rooms[roomId] = {
					id: roomId,
					clientId: '',
					clientInfo: '',
					role: '',
					on(eventName, listener) {
						events[eventName] = listener;
					},
					publish(args, pubCallback) {
						setTimeout(() => {
							const id = newStreamId();
							streams[id] = StreamFactory(id, false);
							pubCallback(null, streams[id]);
						}, DELAY);
					},
					trialPublish(args, pubCallback) {
						setTimeout(() => {
							const id = newStreamId();
							streams[id] = StreamFactory(id, true);
							pubCallback(null, streams[id]);
						}, DELAY);
					},
					leave: noop,
					summon: noop,
					unsummon: noop,
					raiseHand: noop,
					lowerHand: noop,
					addStreamKey: noop,
					removeStreamKey: noop,
				};
				roomCallback(null, rooms[roomId]);
			}, DELAY);
		},
	};
};


test('Video epics', (t1) => {
	t1.test('join video room', (t2) => {
		t2.test('action is emitted on success', (t) => {
			const expectedActions = [
				{
					type: actionTypes.ROOM_JOIN,
					payload: { roomId: '1', token: '1' },
				},
				{
					type: actionTypes.ROOM_JOIN_SUCCESS,
					payload: { roomId: '1' },
				},
			];
			const f2f = mockF2f();
			const store = newStore(f2f);

			store.dispatch(actions.joinRoom({ roomId: '1', token: '1' }));

			wait(() => {
				t.deepEqual(store.getActions(), expectedActions);
				t.end();
			});
		});
	});

	t1.test('Publish', (t2) => {
		t2.test('triggers a stream started event', (t) => {
			const expectedActionTypes = [
				actionTypes.PUBLISH,
				actionTypes.STREAM_STARTED,
			];
			const f2f = mockF2f();
			const store = newStore(f2f);

			store.dispatch(actions.joinRoom({ roomId: '1', token: '1' }));

			waitPromise()
				.then(() => {
					store.dispatch(actions.publish({}));
					return waitPromise();
				})
				.then(() => {
					t.deepEqual(store.getActions().slice(-2).map(getType), expectedActionTypes);
					t.end();
				});
		});

		const multiplePubRequests = (t, isScreen) => {
			const expectedActionTypes = [
				actionTypes.ROOM_JOIN,
				actionTypes.ROOM_JOIN_SUCCESS,
				actionTypes.PUBLISH,
				actionTypes.PUBLISH,
				actionTypes.STREAM_STARTED,
			];
			const f2f = mockF2f();
			const store = newStore(f2f);

			store.dispatch(actions.joinRoom({ roomId: '1', token: '1' }));

			waitPromise()
				.then(() => {
					store.dispatch(actions.publish({ isScreen }));
					store.dispatch(actions.publish({ isScreen }));
					return waitPromise();
				})
				.then(() => {
					t.deepEqual(store.getActions().map(getType), expectedActionTypes);
					t.end();
				});
		};

		t2.test(
			'camera multiple times has no effect until first has resolved',
			t => multiplePubRequests(t, false),
		);

		t2.test(
			'screen multiple times has no effect until first has resolved',
			t => multiplePubRequests(t, true),
		);
	});


	t1.test('Trial publish', (t2) => {
		t2.test('triggers a stream started event', (t) => {
			const expectedActionTypes = [
				actionTypes.TRIAL_PUBLISH,
				actionTypes.STREAM_STARTED,
			];
			const f2f = mockF2f();
			const store = newStore(f2f);

			store.dispatch(actions.joinRoom({ roomId: '1', token: '1' }));

			waitPromise()
				.then(() => {
					store.dispatch(actions.trialPublish({}));
					return waitPromise();
				})
				.then(() => {
					t.deepEqual(store.getActions().slice(-2).map(getType), expectedActionTypes);
					t.end();
				});
		});
	});
});
