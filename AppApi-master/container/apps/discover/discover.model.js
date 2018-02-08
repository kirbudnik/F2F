const REFRESH_INTERVAL = 10; // Seconds


function parseJson(str) {
	try {
		return JSON.parse(str);
	} catch (err) {
		return null;
	}
}

module.exports = ({ redis }) => {
	const setChannels = channels =>
		redis.multi([
			['del', 'discover'],
			...(channels.length > 0
				? [
					['lpush', 'discover', ...channels.map(c => JSON.stringify(c))],
					['expire', 'discover', REFRESH_INTERVAL],
				]
				: []
			),
		]);

	const getChannels = (length = -1) =>
		redis
			.lrangeAsync('discover', 0, length)
			.then(arr => arr.map(json => parseJson(json)));


	return {
		setChannels,
		getChannels,
	};
};
