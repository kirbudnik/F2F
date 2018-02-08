module.exports = ({ crypto, config }) => {
	const {
		RESTREAM_PLATFORMS,
		OAUTH_STATE_SECRET,
	} = config;

	const wrap = promise => promise
		.then(data => [null, data])
		.catch(err => [err]);


	// Return whether string is a supported restream platform
	function isRestreamPlatform(platform) {
		return RESTREAM_PLATFORMS.includes(platform);
	}

	const csrfHash = csrfToken =>
		crypto
			.createHmac('sha256', OAUTH_STATE_SECRET)
			.update(csrfToken, 'utf8')
			.digest('hex');


	return {
		wrap,
		isRestreamPlatform,
		csrfHash,
	};
};
