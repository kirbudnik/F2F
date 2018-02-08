const test = require('tape').test;
const { ObjectID: objectId } = require('mongodb');
const migrations = require('../index.js');


const settings = {
	isViewerCountOn: true,
	isQueueSoundOn: true,
	isAutoJoinOn: false,
	isPayBtnOn: true,
};


const v3 = {
	version: 3,
	_id: objectId('aaaaaaaaaaaa'),
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
			settings,
		},
	],
	settings,
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

const v4 = {
	...v3,
	version: 4,
	email: 'google@gmail.com',
};


test('User model v4', (t1) => {
	t1.test('validation', (t) => {
		migrations.fromTo(4, 4, v4)
			.then((user) => {
				t.deepEqual(user, v4, 'is successful');
				t.end();
			});
	});
	t1.test('v3 to v4 migration', (t) => {
		migrations.fromTo(3, 4, v3)
			.then((user) => {
				t.deepEqual(user, v4, 'is successful');
				t.end();
			});
	});
	t1.test('v4 to v3 migration', (t) => {
		migrations.fromTo(4, 3, v4)
			.then((user) => {
				t.deepEqual(user, v3, 'is successful');
				t.end();
			});
	});
});

