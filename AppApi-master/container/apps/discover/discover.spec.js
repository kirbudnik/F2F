const test = require('tape').test;
const _ = require('lodash');
const Select = require('./discover.select');


// Helpers to generate fake users
const coverSrc = 'https://f2f.live/cover.jpg';
const avatarSrc = 'https://f2f.live/avatar.jpg';
const about = 'About me!';

const createChannel = name => ({
	name,
	avatarSrc,
	coverSrc,
	about,
	lowercaseName: name.toLowerCase(),
});

const createUser = (username, channelNames) => ({
	username,
	lowercaseUsername: username.toLowerCase(),
	channels: channelNames.map(name => createChannel(name)),
});


test('Discovery', (t1) => {
	t1.test('does not select more than the max number of channels allowed', (t) => {
		const select = Select({ _, config: { MAX_DISCOVERABLES: 3 } });
		const users = [
			createUser('dbriggs', ['Fitness101', 'Nutrition101', 'Meditation101']),
			createUser('AlexG', ['BusinessProTV', 'MasteringF2F']),
		];
		const broadcastIds = [];

		t.equal(select.chooseDiscoverables(users, broadcastIds).length, 3);
		t.end();
	});

	t1.test('isLive bool is set correctly', (t) => {
		const select = Select({ _, config: { MAX_DISCOVERABLES: 100 } });
		const users = [
			createUser('dbriggs', ['Fitness101', 'Nutrition101', 'Meditation101']),
			createUser('AlexG', ['BusinessProTV', 'MasteringF2F']),
		];
		const broadcastIds = ['dbriggs.nutrition101'];
		const discoverables = select.chooseDiscoverables(users, broadcastIds);

		t.equal(discoverables.filter(c => c.isLive)[0].channelName, 'Nutrition101');
		t.equal(discoverables.filter(c => !c.isLive && c.channelName !== 'Nutrition101').length, 4);
		t.end();
	});

	t1.test('live broadcasts are always selected', (t) => {
		const select = Select({ _, config: { MAX_DISCOVERABLES: 2 } });
		const users = [
			createUser('dbriggs', ['Fitness101', 'Nutrition101', 'Meditation101']),
			createUser('AlexG', ['BusinessProTV', 'MasteringF2F']),
			createUser('geige', ['Scrum', 'Movies']),
		];
		const broadcastIds = ['alexg.businessprotv', 'dbriggs.nutrition101'];
		const discoverables = select.chooseDiscoverables(users, broadcastIds);
		const discoverableIds = discoverables
			.map(c => `${c.username.toLowerCase()}.${c.channelName.toLowerCase()}`);

		t.equal(_.intersection(discoverableIds, broadcastIds).length, 2);
		t.end();
	});
});
