const test = require('tape').test;
const { ObjectID: objectId } = require('mongodb');
const migrations = require('../index.js');


const v2Settings = {
	isViewerCountOn: true,
	isQueueSoundOn: true,
	isAutoJoinOn: false,
};

const v3Settings = {
	...v2Settings,
	isPayBtnOn: true,
};

const v2 = {
	version: 2,
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
			settings: v2Settings,
		},
	],
	settings: v2Settings,
};

const v3 = {
	...v2,
	version: 3,
	channels: [
		{
			name: 'Teaching',
			lowercaseName: 'teaching',
			settings: v3Settings,
		},
	],
	settings: v3Settings,
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
};


test('User model v3', (t1) => {
	t1.test('validation', (t) => {
		migrations.fromTo(3, 3, v3)
			.then((user) => {
				t.deepEqual(user, v3, 'is successful');
				t.end();
			});
	});
	t1.test('v2 to v3 migration', (t) => {
		migrations.fromTo(2, 3, v2)
			.then((user) => {
				t.deepEqual(user, v3, 'is successful');
				t.end();
			});
	});
	t1.test('v3 to v2 migration', (t) => {
		// Want to ensure stripe gets stripped as well
		const v3WithStripe = {
			...v3,
			stripe: {
				platformId: 's',
				linkedAt: 1512199355,
			},
		};

		migrations.fromTo(3, 2, v3WithStripe)
			.then((user) => {
				t.deepEqual(user, v2, 'is successful');
				t.end();
			});
	});
});

