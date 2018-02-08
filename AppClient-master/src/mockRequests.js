import { addMock } from 'services/request';
import querystring from 'querystring';

const getQueries = () => querystring.parse(location.search.split('?')[1]);

const userObj = {
	id: '123',
	username: 'designer',
	about: 'Hello there',
	avatarSrc: 'http://i.imgur.com/F32TzLY.png',
	coverSrc: 'http://i.imgur.com/F32TzLY.png',
	channels: [
		{
			name: 'BestChannel',
			lowercaseName: 'bestchannel',
			about: 'This is the best channel',
			avatarSrc: 'http://i.imgur.com/F32TzLY.png',
			coverSrc: 'http://i.imgur.com/F32TzLY.png',
		},
		{
			name: 'Mom',
			lowercaseName: 'mom',
			about: 'I talk to my mom on this channel.',
		},
	],
};

const channelObj = {
	name: 'BestChannel',
	about: 'This is the best channel',
	avatarSrc: 'http://i.imgur.com/F32TzLY.png',
	coverSrc: 'http://i.imgur.com/F32TzLY.png',
	owner: {
		id: '123',
		username: 'designer',
		about: 'Hello there',
		avatarSrc: 'http://i.imgur.com/F32TzLY.png',
		coverSrc: 'http://i.imgur.com/F32TzLY.png',
	},
};

const discoverObj = [
	{
		username: 'Username',
		channelName: 'channelName',
		link: '/username/channelName',
		avatarSrc: 'http://i.imgur.com/F32TzLY.png',
		coverSrc: 'http://i.imgur.com/czF0bnq.png',
		isLive: true,
	},
	{
		username: 'Username2',
		channelName: 'channelName2',
		link: '/username2/channelName2',
		avatarSrc: 'http://i.imgur.com/F32TzLY.png',
		coverSrc: 'http://i.imgur.com/czF0bnq.png',
		isLive: false,
	},
	{
		username: 'Username3',
		channelName: 'channelName3',
		link: '/username3/channelName3',
		avatarSrc: null,
		coverSrc: null,
		isLive: true,
	},
	{
		username: 'Username4',
		channelName: 'channelName4',
		link: '/username4/channelName4',
		avatarSrc: null,
		coverSrc: 'http://i.imgur.com/F32TzLY.png',
		isLive: false,
	},
];

const settingsPaymentObj = {
	btnText: 'Support',
	btnColor: '#ffffff',
	descriptionText: 'Support the Broadcaster!',
	isCustomAmountOn: true,
	isStripeConnected: true,
	presetAmounts: [500, 1000, 3000],
	btnLocations: {
		channel: true,
		profile: true,
		broadcast: true,
	},
};

const transactionsArray = [
	{
		id: 'test1',
		amount: 3000,
		senderUsername: 'Tester',
		createdAt: 1511961556,
	},
	{
		id: 'test2',
		amount: 100,
		senderUsername: 'Buddy',
		createdAt: 1511971466,
	},
];

const longText = 'this is https://veryverylongtextfrombadbadbaduserwhoaregoingtobreakour.chat';

// Auth
const mocks = {
	auth: [{
		method: 'GET',
		path: '/api/users',
	}, () => ({
		delay: 2000,
		statusCode: 200,
		body: 'anon' in getQueries()
		? {
			isAuth: false,
		} : {
			isAuth: true,
			...userObj,
		},
	})],

	loginRedirect: [{
		method: 'GET',
		path: '/api/oauth/:platform/login',
	}, () => ({
		statusCode: 200,
		body: {
			redirectUrl: `${location.protocol}//${location.host}/api/oauth/redirect`,
		},
	})],

	login: [{
		method: 'POST',
		path: '/api/oauth/:platform/login',
	}, () => ({
		statusCode: 200,
		body: {
			signupToken: '123',
		},
	})],

	getUser: [{
		method: 'GET',
		path: '/api/users/:username',
	}, req => ({
		statusCode: 200,
		body: {
			...userObj,
			isOwner: req.params.username === 'designer',
		},
	})],

	getChannel: [{
		method: 'GET',
		path: '/api/users/:username/channels/:channelName',
	}, req => ({
		delay: 2000,
		statusCode: 200,
		body: {
			...channelObj,
			isOwner: req.params.username === 'designer',
		},
	})],

	usernameAvailability: [{
		method: 'GET',
		path: '/api/users/:username/availability',
	}, req => ({
		statusCode: 200,
		body: {
			isAvailable: req.params.username !== 'unavailable',
		},
	})],

	createUser: [{
		method: 'POST',
		path: '/api/users',
	}, req => ({
		statusCode: 200,
		body: {
			id: '123',
			username: req.body.username,
		},
	})],

	createChannel: [{
		method: 'POST',
		path: '/api/users/:username/channels',
	}, () => ({
		statusCode: 200,
		body: {
			...channelObj,
		},
	})],

	setUserAbout: [{
		method: 'POST',
		path: '/api/users/:username/about',
	}, () => ({
		statusCode: 200,
		body: {
			...userObj,
		},
	})],

	setUserAvatar: [{
		method: 'POST',
		path: '/api/users/:username/avatar',
	}, () => ({
		statusCode: 200,
		body: {
			...userObj,
		},
	})],

	setUserCover: [{
		method: 'POST',
		path: '/api/users/:username/cover',
	}, () => ({
		statusCode: 200,
		body: {
			...userObj,
		},
	})],

	setChannelAbout: [{
		method: 'POST',
		path: '/api/users/:username/channels/:channelName/about',
	}, () => ({
		statusCode: 200,
		body: {
			...channelObj,
		},
	})],

	setChannelAvatar: [{
		method: 'POST',
		path: '/api/users/:username/channels/:channelName/avatar',
	}, () => ({
		statusCode: 200,
		body: {
			...channelObj,
		},
	})],

	setChannelCover: [{
		method: 'POST',
		path: '/api/users/:username/channels/:channelName/cover',
	}, () => ({
		statusCode: 200,
		body: {
			...channelObj,
		},
	})],

	getChat: [{
		method: 'GET',
		path: '/api/broadcasts/:broadcastId/chat',
	}, () => ({
		statusCode: 200,
		body: {
			broadcastId: '',
			comments: [...Array.from(
				{ length: 30 }, (v, id) => ({ color: '#fff', id: `${id}`, username: `username${id % 3}`, text: `text ${id}` }),
			), { id: 'longText', username: 'LongText', text: longText }],
			start: 0,
			end: 31,
		},
	})],

	getBroadcast: [{
		method: 'GET',
		path: '/api/broadcasts/:broadcastId',
	}, () => ({
		statusCode: 200,
		body: {
		},
	})],

	postKeepAlive: [{
		method: 'POST',
		path: '/api/broadcasts/:broadcastId/keepalive',
	}, () => ({
		statusCode: 200,
		body: {
		},
	})],

	getDiscover: [{
		method: 'GET',
		path: '/api/discover',
	}, () => ({
		statusCode: 200,
		body: {
			channels: discoverObj,
		},
	})],

	getSettingsPayment: [{
		method: 'GET',
		path: '/api/settings/pay',
	}, () => ({
		statusCode: 200,
		body: {
			pay: {
				...settingsPaymentObj,
			},
		},
	})],

	changePaySettings: [{
		method: 'POST',
		path: '/api/settings/pay',
	}, () => ({
		statusCode: 200,
		body: {},
	})],

	getTransactions: [{
		method: 'GET',
		path: '/api/pay',
	}, () => ({
		statusCode: 200,
		body: {
			payments: transactionsArray,
		},
	})],
};


// Comment out any you don't want to use
if (process.env.DESIGN_MODE || process.env.NODE_ENV === 'design') {
	addMock(...mocks.auth);
	addMock(...mocks.loginRedirect);
	addMock(...mocks.login);
	addMock(...mocks.getUser);
	addMock(...mocks.getChannel);
	addMock(...mocks.usernameAvailability);
	addMock(...mocks.createUser);
	addMock(...mocks.createChannel);
	addMock(...mocks.setUserAbout);
	addMock(...mocks.setUserAvatar);
	addMock(...mocks.setUserCover);
	addMock(...mocks.setChannelAbout);
	addMock(...mocks.setChannelAvatar);
	addMock(...mocks.setChannelCover);
	addMock(...mocks.getChat);
	addMock(...mocks.getBroadcast);
	addMock(...mocks.postKeepAlive);
	addMock(...mocks.getDiscover);
	addMock(...mocks.getSettingsPayment);
	addMock(...mocks.changePaySettings);
	addMock(...mocks.getTransactions);
}
