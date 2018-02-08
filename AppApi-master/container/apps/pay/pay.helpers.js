module.exports = () => {
	const wrap = promise => promise
		.then(data => [null, data])
		.catch(err => [err]);

	const isNonEmptyString = str => typeof str === 'string' && str.length > 0;

	return {
		wrap,
		isNonEmptyString,
	};
};
