const Requests = require('./google.requests');
const Google = require('./google');


module.exports = ({ atob, joi, request, config, oauthHelpers }) => {
	const requests = Requests({
		request,
		config,
	});

	const google = Google({
		atob,
		joi,
		requests,
		oauthHelpers,
		config,
	});

	return google;
};
