/* eslint no-console: off */
const fs = require('fs');
const path = require('path');
const InfusionSoftAPI = require('infusionsoft-api');
const Events = require('./logger.events');


const now = () => Math.floor(Date.now());

const writeToFile = stream => (...args) =>
	stream.write(`${now()}: ${args.join(' ')}\n`);


module.exports = (config) => {
	const stream = fs.createWriteStream(
		path.join('/', 'var', 'log', 'f2f.app.log'),
		{ flags: 'a' },
	);

	const errorStream = fs.createWriteStream(
		path.join('/', 'var', 'log', 'f2f.app.error.log'),
		{ flags: 'a' },
	);

	const write = writeToFile(stream);
	const writeError = writeToFile(errorStream);


	function log(...args) {
		console.log(...args);
		write(...args);
	}

	function error(...args) {
		// Stringify errors to remove the stack trace
		log('Error', args.join(' '));
		writeError(...args);
	}

	const event = Events({ config, InfusionSoftAPI, error, log });

	return {
		log,
		error,
		event,
	};
};
