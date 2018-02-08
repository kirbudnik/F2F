

module.exports = (encodeURIComponent) => {
	// Create a url string with query parameters
	function urlString({ url, params }) {
		let query = `${url}?`;
		Object.keys(params).forEach((key, i) => {
			if (i > 0) {
				query += '&';
			}
			query += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
		});
		return query;
	}

	const now = () => Math.floor(Date.now() / 1000);

	return {
		urlString,
		now,
	};
};
