module.exports = (crypto) => {
	const appSecretProof = (accessToken, secret) =>
		crypto
			.createHmac('sha256', secret)
			.update(accessToken, 'utf8')
			.digest('hex');

	return { appSecretProof };
};
