const test = require('tape').test;
const { ObjectID: objectId } = require('mongodb');
const migrations = require('../index.js');


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


test('User model v1', (t1) => {
	t1.test('validation', (t) => {
		migrations.fromTo(1, 1, v1)
			.then((user) => {
				t.deepEqual(user, v1, 'is successful');
				t.end();
			});
	});
});
