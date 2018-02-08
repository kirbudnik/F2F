/*
Wrapper around the specific request module that we are using. Abstract away the
details of the module and expose a defined interface. All messages are JSON.

Usage:
	// GET
	request({
		method: 'GET',
		uri: 'http://localhost/room',
		query: { roomId: '123' },
	})
		.then(resp => console.log(resp))
		.catch(err => console.log(err));

	// POST
	request({
		method: 'POST',
		uri: 'http://localhost/room',
		timeout: 1000,
		body: { roomId: '123' },
	})
		.then(resp => console.log(resp))
		.catch(err => console.log(err));

	// DELETE
	request({
		method: 'DELETE',
		uri: 'http://localhost/room',
		timeout: 5000,
		body: { roomId: '123' },
	})
		.then(resp => console.log(resp))
		.catch(err => console.log(err));
*/

import querystring from 'querystring';
import superagent from 'superagent';
import { cookies } from 'services/utils';
import Request from './request';
import Real from './request.real';
import Mock from './request.mock';


// Take in optional query paramters to add fake disruption to the requests
const between = (num, min, max) => Math.min(Math.max(num, min), max);
const queryParams = querystring.parse(location.search.slice(1));
const options = {};

// Chaos is a decimal between 0 and 1 representing % chance to fail
if (queryParams.chaos && !isNaN(parseFloat(queryParams.chaos, 10))) {
	options.chaos = between(queryParams.chaos, 0, 1);
}

// Latency will cause us to add addition delay to network requests. The latency added to each
// request will be a random number between 0 and the value provided.
if (queryParams.latency && !isNaN(parseFloat(queryParams.latency, 10))) {
	options.latency = between(queryParams.latency, 0, 5) * 1000;
}

const real = Real(superagent, cookies, options);
const mock = Mock(URL);
const request = Request(real, mock);

export const addMock = mock.add;
export default request.send;

