const express = require('express');
const joi = require('joi');
const Model = require('./pay.model');
const Helpers = require('./pay.helpers');
const Routes = require('./pay.routes');
const Controller = require('./pay.controller.js');

module.exports = ({
	mongo,
	config,
	logger,
	stripe,
	broadcastsController,
	usersController,
	usersMiddleware,
}) => {
	const model = Model({
		mongo,
		joi,
		logger,
	});

	const helpers = Helpers();

	const controller = Controller({
		config,
		logger,
		stripe,
		helpers,
		model,
		broadcastsController,
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
