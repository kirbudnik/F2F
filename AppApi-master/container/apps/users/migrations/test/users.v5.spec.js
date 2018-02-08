const test = require('tape').test;
const { ObjectID: objectId } = require('mongodb');
const migrations = require('../index.js');


const settings = overrides => ({
	isViewerCountOn: true,
	isQueueSoundOn: true,
	isAutoJoinOn: false,
	isPayBtnOn: true,
	...overrides,
});


const v4 = {
	version: 4,
	_id: objectId('aaaaaaaaaaaa'),
	email: 'google@gmail.com',
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
			settings: settings(),
		},
	],
	settings: settings(),
	pay: {
		isApproved: false,
		hasApplied: false,
		isStripeConnected: false,
		currency: 'usd',
		btnColor: '#ff9700',
		btnText: '',
		descriptionText: '',
		isCustomAmountOn: true,
		presetAmounts: [500, 1000, 3000],
		btnLocations: {
			channel: true,
			profile: true,
		},
	},
	stripe: {
		platformId: 's',
		linkedAt: 1512199355,
	},
};

const v5 = {
	...v4,
	version: 5,
	settings: settings({ isAutoJoinOn: true }),
};

test('User model v5', (t1) => {
	t1.test('validation', (t) => {
		migrations.fromTo(5, 5, v5)
			.then((user) => {
				t.deepEqual(user, v5, 'is successful');
				t.end();
			});
	});
	t1.test('v4 to v5 migration', (t) => {
		migrations.fromTo(4, 5, v4)
			.then((user) => {
				t.deepEqual(user, v5, 'is successful');
				t.end();
			});
	});
	t1.test('v5 to v4 migration', (t) => {
		migrations.fromTo(5, 4, v5)
			.then((user) => {
				t.deepEqual(user, v4, 'is successful');
				t.end();
			});
	});
});
