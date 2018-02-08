const crypto = require('crypto');
const express = require('express');
const joi = require('joi');
const _ = require('lodash');

const Model = require('./restream.model.js');
const Helpers = require('./restream.helpers.js');
const Controller = require('./restream.controller.js');
const Routes = require('./restream.routes.js');


module.exports = ({ mongo, config, logger, oauth, usersController, usersMiddleware }) => {
	const model = Model({ mongo, joi, logger });
	const helpers = Helpers({ crypto, config });
	const controller = Controller({
		_,
		model,
		logger,
		oauth,
		helpers,
		usersController,
	});
	const routes = Routes({ express, usersMiddleware, controller });

	return { routes };
};
