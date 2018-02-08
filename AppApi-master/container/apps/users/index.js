const assert = require('assert');
const Aws = require('aws-sdk');
const Busboy = require('busboy');
const crypto = require('crypto');
const express = require('express');
const jwtLib = require('jsonwebtoken');
const sharp = require('sharp');
const Routes = require('./users.routes');
const Helpers = require('./users.helpers');
const migrations = require('./migrations');
const Model = require('./users.model.js');
const Controller = require('./users.controller.js');
const Middleware = require('./users.middleware.js');
const { URL } = require('url');


// Aws module is used for digital ocean 'spaces'
const endpoint = new Aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new Aws.S3({ endpoint });


module.exports = ({ mongo, config, logger, oauth }) => {
	const model = Model({
		mongo,
		config,
		logger,
		migrations,
	});

	const helpers = Helpers({
		assert,
		s3,
		crypto,
		jwtLib,
		URL,
		config,
	});

	const middleware = Middleware({
		Busboy,
		sharp,
		model,
		helpers,
		config,
		logger,
	});

	const controller = Controller({
		config,
		helpers,
		model,
		logger,
		oauth,
	});

	const routes = Routes({
		express,
		middleware,
		controller,
	});

	return {
		routes,
		middleware,
		controller: {
			addRestreamPlatform: controller.addRestreamPlatform,
			incrBroadcastCount: controller.incrBroadcastCount,
			toggleBroadcastSettings: controller.toggleBroadcastSettings,
			linkStripe: controller.linkStripe,
			unlinkStripe: controller.unlinkStripe,
			togglePaySettings: controller.togglePaySettings,
			findByUsername: controller.findByUsername,
			appliedForPay: controller.appliedForPay,
			getUsersWithChannels: controller.getUsersWithChannels,
		},
	};
};
