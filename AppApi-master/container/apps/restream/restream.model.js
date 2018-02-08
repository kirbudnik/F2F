module.exports = ({ mongo, joi, logger }) => {
	const restreams = platform => mongo.db().collection(`transcode.${platform}`);
	const { objectId } = mongo;
	const optionalString = joi.string().allow('', null);


	// Create indexes
	mongo.onConnect(() => {
		const indexPlatformIds = platform =>
			restreams(platform).createIndex({ platformId: 1 }, { unique: true })
				.catch(err => logger.error('Indexing restream', err));

		indexPlatformIds('youtube');
		indexPlatformIds('facebook');

		// restreams('youtube').find().toArray().then(arr => console.log(arr));
	});


	// Define Schema
	const Schema = joi.object().keys({
		_id: joi.object().type(objectId),
		platformId: joi.string().required(),
		email: joi.string().required(),
		emailVerified: joi.boolean(),
		name: optionalString,
		firstName: optionalString,
		accessToken: optionalString,
		accessTokenExp: joi.number().integer(),
		refreshToken: optionalString,
	});


	// Helpers
	const validate = obj => Schema.validate(obj, { stripUnknown: true });
	const preValidate = cb => obj => validate(obj).then(cb);


	// Queries
	const findByPlatformId = (platform, platformId) =>
		restreams(platform).findOne({ platformId });

	const save = platform => preValidate(obj =>
		restreams(platform).save(obj).then((resp) => {
			if (obj._id) {
				return obj;
			}
			return resp.ops[0];
		}),
	);


	return {
		findByPlatformId,
		save,
	};
};
