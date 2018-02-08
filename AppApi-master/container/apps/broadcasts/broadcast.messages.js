module.exports = {
	chat: data => JSON.stringify({
		type: 'chat',
		data,
	}),
	layout: layout => JSON.stringify({
		type: 'layout',
		data: { layout },
	}),
	live: () => JSON.stringify({
		type: 'live',
	}),
	dead: () => JSON.stringify({
		type: 'dead',
	}),
	pay: data => JSON.stringify({
		type: 'pay',
		data,
	}),
	settings: settings => JSON.stringify({
		type: 'settings',
		data: settings,
	}),
};
