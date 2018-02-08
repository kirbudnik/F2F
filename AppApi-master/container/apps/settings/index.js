const crypto = require('crypto');
const express = require('express');
const hexColorRegex = require('hex-color-regex');
const _ = require('lodash');
const Helpers = require('./settings.helpers');
const Routes = require('./settings.routes');
const Controller = require('./settings.controller.js');

module.exports = ({ config, logger, stripe, usersController, usersMiddleware }) => {
	const helpers = Helpers({
		crypto,
		config,
	});

	const controller = Controller({
		_,
		hexColorRegex,
		config,
		logger,
		stripe,
		helpers,
		usersController,
	});

	const routes = Routes({
		express,
		controller,
		usersMiddleware,
	});

	return {
		routes,
	};
};
