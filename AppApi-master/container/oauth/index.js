const atob = require('atob');
const crypto = require('crypto');
const joi = require('joi');
const request = require('request-promise');

const OauthHelpers = require('./oauth.helpers');
const Google = require('./google');
const Facebook = require('./facebook');

module.exports = (config) => {
	const oauthHelpers = OauthHelpers(encodeURIComponent);

	const google = Google({
		atob,
		joi,
		request,
		config,
		oauthHelpers,
	});

	const facebook = Facebook({
		crypto,
		joi,
		request,
		config,
		oauthHelpers,
	});

	// Login will use platform name of 'google' but restream will use 'youtube'.
	// Code is the same for both.
	return {
		google,
		youtube: google,
		facebook,
	};
};
