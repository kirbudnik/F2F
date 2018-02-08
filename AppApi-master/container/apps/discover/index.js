const express = require('express');
const _ = require('lodash');

const Routes = require('./discover.routes');
const Model = require('./discover.model.js');
const Select = require('./discover.select.js');
const Controller = require('./discover.controller.js');


module.exports = ({ redis, config, logger, usersController, broadcastsController }) => {
	const model = Model({ _, redis });

	const select = Select({ _, config });

	const controller = Controller({
		model,
		select,
		logger,
		usersController,
		broadcastsController,
	});

	const routes = Routes({
		express,
		controller,
	});

	return { routes };
};
