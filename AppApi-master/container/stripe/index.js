const joi = require('joi');
const request = require('request-promise');
const StripePackage = require('stripe');
const { URL } = require('url');
const Stripe = require('./stripe');

module.exports = (config) => {
	const { CLIENT_ID, SECRET_KEY } = config.stripe;

	const stripeLib = StripePackage(SECRET_KEY);

	const stripe = Stripe({
		joi,
		request,
		URL,
		stripeLib,
		CLIENT_ID,
		SECRET_KEY,
	});

	return stripe;
};
