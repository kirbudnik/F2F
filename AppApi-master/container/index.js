const assert = require('assert');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const methodOverride = require('method-override');
const Mongo = require('./mongo');
const Redis = require('./redis');
const Config = require('./config');
const Logger = require('./logger');
const Oauth = require('./oauth');
const Stripe = require('./stripe');
const apps = require('./apps');


const config = Config(assert);
const logger = Logger(config);
const mongo = Mongo(logger);
const redis = Redis(logger);
const oauth = Oauth(config);
const stripe = Stripe(config);

const { users, broadcasts, discover, pay, restream, settings } = apps({
	config,
	logger,
	mongo,
	redis,
	oauth,
	stripe,
});

const httpApp = express();
httpApp
	.use(bodyParser.json({ limit: '20mb' }))
	.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
	.use(cookieParser())
	.use(users.middleware.multipartFormParser)
	// Get user from cookies
	.use(users.middleware.authCookies)
	// Protect from csrf attacks
	.use(users.middleware.csrfDefend)
	// .use(express.static(__dirname, '/public'))
	.get('/api/logout', (req, res) => {
		if (req.user.username) {
			logger.log('Logout', req.user.username);
		}
		req.logout();
		res.redirect('/');
	})
	.use('/api/users', users.routes)
	.use('/api/broadcasts', broadcasts.routes)
	.use('/api/discover', discover.routes)
	.use('/api/pay', pay.routes)
	.use('/api/restream', restream.routes)
	.use('/api/settings', settings.routes)
	.use((req, res) => {
		// 404 catcher
		res.sendStatus(404);
	})
	.use(methodOverride())
	.use((err, req, res) => {
		// Invalid input
		res.sendStatus(400);
	})
	.listen(3000);
