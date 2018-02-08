const crypto = require('crypto');
const express = require('express');
const hexColorRegex = require('hex-color-regex');
const jwtLib = require('jsonwebtoken');
const requestErrors = require('request-promise/errors');
const request = require('request-promise');
const uuid = require('uuid');
const validator = require('validator');


const Routes = require('./broadcast.routes');
const Model = require('./broadcast.model.js');
const Controller = require('./broadcast.controller.js');
const Middleware = require('./broadcast.middleware');
const Requests = require('./broadcast.requests');
const Helpers = require('./broadcast.helpers');
const messages = require('./broadcast.messages');


module.exports = ({ redis, config, logger, usersController, usersMiddleware }) => {
	const requests = Requests(request, config);

	const helpers = Helpers({
		config,
		crypto,
		jwtLib,
		hexColorRegex,
		uuid,
		validator,
	});

	const model = Model(redis);

	const middleware = Middleware({
		model,
		logger,
		helpers,
	});

	const controller = Controller({
		config,
		logger,
		helpers,
		requests,
		messages,
		requestErrors,
		model,
		usersController,
	});

	const routes = Routes({
		express,
		usersMiddleware,
		middleware,
		controller,
	});

	return {
		routes,
		controller: {
			payNotification: controller.payNotification,
			getLiveBroadcastIds: controller.getLiveBroadcastIds,
		},
	};
};
