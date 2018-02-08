module.exports = ({ crypto, config }) => {
	const { OAUTH_STATE_SECRET } = config;

	const wrap = promise => promise
		.then(data => [null, data])
		.catch(err => [err]);

	const sha256 = (str, secret) => crypto
		.createHmac('sha256', secret)
		.update(str, 'utf8')
		.digest('hex');

	// Pay amount is based on smallest units (cents for usd)
	const isValidPayAmount = amount =>
		typeof amount === 'number' && amount >= 50;

	const isNonEmptyString = str => typeof str === 'string' && str.length > 0;


	const csrfHash = csrfToken => sha256(csrfToken, OAUTH_STATE_SECRET);

	const isBool = val => typeof val === 'boolean';

	const isAllBools = dict =>
		Object.values(dict).length === Object.values(dict).filter(isBool).length;

	const hasOnlyTheseKeys = (dict, keys) =>
		Object.keys(dict).filter(key => keys.includes(key)).length === Object.keys(dict).length;

	return {
		wrap,
		sha256,
		isValidPayAmount,
		isNonEmptyString,
		csrfHash,
		isAllBools,
		hasOnlyTheseKeys,
	};
};
