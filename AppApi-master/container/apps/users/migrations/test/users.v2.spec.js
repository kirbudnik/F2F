const test = require('tape').test;
const { ObjectID: objectId } = require('mongodb');
const migrations = require('../index.js');


const settings = {
	isViewerCountOn: true,
	isQueueSoundOn: true,
	isAutoJoinOn: false,
};

const v1 = {
	_id: objectId('aaaaaaaaaaaa'),
	version: 1,
	username: 'JaneAustin',
	lowercaseUsername: 'janeaustin',
	createdAt: 1512199355,
	oauth: {
		google: {
			platformId: 'g1',
			name: 'Austin',
			email: 'google@gmail.com',
			emailVerified: true,
			accessToken: 'a',
		},
	},
	restream: {
		youtube: [objectId('aaaaaaaaaaaa')],
	},
	channels: [
		{
			name: 'Teaching',
			lowercaseName: 'teaching',
		},
	],
};


const v2 = {
	...v1,
	version: 2,
	channels: [
		{
			name: 'Teaching',
			lowercaseName: 'teaching',
			settings,
		},
	],
	settings,
};


test('User model v2', (t1) => {
	t1.test('validation', (t) => {
		migrations.fromTo(2, 2, v2)
			.then((user) => {
				t.deepEqual(user, v2, 'is successful');
				t.end();
			});
	});
	t1.test('v1 to v2 migration', (t) => {
		migrations.fromTo(1, 2, v1)
			.then((user) => {
				t.deepEqual(user, v2, 'is successful');
				t.end();
			});
	});
	t1.test('v2 to v1 migration', (t) => {
		migrations.fromTo(2, 1, v2)
			.then((user) => {
				t.deepEqual(user, v1, 'is successful');
				t.end();
			});
	});
});

