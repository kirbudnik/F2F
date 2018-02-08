// Stripe oauth process:
// https://stripe.com/docs/connect/standard-accounts#integrating-oauth
module.exports = ({ joi, request, URL, stripeLib, CLIENT_ID, SECRET_KEY }) => {
	const clientData = {
		client_id: CLIENT_ID,
		client_secret: SECRET_KEY,
	};


	function urlString({ url, params }) {
		const newUrl = new URL(url);

		Object.keys(params).forEach((key) => {
			newUrl.searchParams.append(key, params[key]);
		});
		return newUrl.href;
	}


	// Generate a url query string to send the user to facebook for Oauth confirmation
	const redirectUrl = state => urlString({
		url: 'https://connect.stripe.com/oauth/authorize',
		params: {
			state,
			response_type: 'code',
			scope: 'read_write',
			client_id: CLIENT_ID,
			always_prompt: true,
		},
	});

	const exchangeCodeForCredentials = code => request({
		method: 'POST',
		json: true,
		uri: 'https://connect.stripe.com/oauth/token',
		timeout: 5000,
		form: {
			...clientData,
			code,
			grant_type: 'authorization_code',
		},
	})
		.then((body) => {
			if (typeof body.stripe_user_id !== 'string') {
				throw new Error('Stripe: Invalid credentials in response');
			}
			return body.stripe_user_id;
		});


	const revokeStripeAccess = stripeUserId => request({
		method: 'POST',
		json: true,
		uri: 'https://connect.stripe.com/oauth/deauthorize',
		timeout: 5000,
		form: {
			...clientData,
			stripe_user_id: stripeUserId,
		},
	});


	const chargeSchema = joi.object().keys({
		id: joi.string().required(),
		destination: joi.string().required(),
	});

	const createCharge = ({ stripeUserId, token, ...args }) =>
		stripeLib.charges.create({
			...args,
			source: token.id,
			destination: {
				account: stripeUserId,
			},
		})
		.then(charge =>
			chargeSchema.validate(charge, { stripUnknown: true }),
		);


	return {
		redirectUrl,
		createCharge,
		exchangeCodeForCredentials,
		revokeStripeAccess,
	};
};
