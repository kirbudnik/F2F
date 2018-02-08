const Users = require('./users');
const Broadcasts = require('./broadcasts');
const Discover = require('./discover');
const Pay = require('./pay');
const Restream = require('./restream');
const Settings = require('./settings');

module.exports = ({ mongo, redis, oauth, stripe, config, logger }) => {
	const users = Users({
		mongo,
		config,
		logger,
		oauth,
	});

	const broadcasts = Broadcasts({
		redis,
		config,
		logger,
		usersController: users.controller,
		usersMiddleware: users.middleware,
	});

	const discover = Discover({
		redis,
		config,
		logger,
		broadcastsController: broadcasts.controller,
		usersController: users.controller,
	});

	const pay = Pay({
		mongo,
		config,
		logger,
		stripe,
		broadcastsController: broadcasts.controller,
		usersController: users.controller,
		usersMiddleware: users.middleware,
	});

	const restream = Restream({
		mongo,
		config,
		logger,
		oauth,
		usersController: users.controller,
		usersMiddleware: users.middleware,
	});

	const settings = Settings({
		config,
		logger,
		stripe,
		usersController: users.controller,
		usersMiddleware: users.middleware,
	});

	return {
		users,
		broadcasts,
		discover,
		pay,
		restream,
		settings,
	};
};
