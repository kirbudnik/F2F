const Helpers = require('./facebook.helpers');
const Requests = require('./facebook.requests');
const Facebook = require('./facebook');

module.exports = ({ crypto, joi, request, config, oauthHelpers }) => {
	const helpers = Helpers(crypto);
	const requests = Requests({ request, helpers, config });
	const facebook = Facebook({ joi, config, oauthHelpers, requests });
	return facebook;
};
