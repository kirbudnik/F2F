/* eslint no-param-reassign: off */

module.exports = ({ joi, utils }) => {
	const version = 1;

	const {
		now,
		optionalString,
		objectIdType,
		arrayOfUniqueObjectIds,
	} = utils;

	const OauthSchema = joi.object().keys({
		platformId: joi.string().required(),
		email: joi.string().required(),
		emailVerified: joi.boolean(),
		name: optionalString,
		firstName: optionalString,
		accessToken: optionalString,
		accessTokenExp: joi.number().integer(),
		refreshToken: optionalString,
	});

	const ChannelSchema = joi.object().keys({
		name: joi.string().required(),
		lowercaseName: joi.string().lowercase().required(),
		about: optionalString,
		avatarSrc: optionalString,
		coverSrc: optionalString,
	});

	const UserSchema = joi.object().keys({
		version: joi.number().integer().valid(version).default(version),
		_id: objectIdType,
		username: joi.string(),
		lowercaseUsername: joi.string().lowercase(),
		about: optionalString,
		avatarSrc: optionalString,
		coverSrc: optionalString,
		refCode: optionalString,
		broadcastCount: joi.number().integer(),
		lastBroadcast: joi.number().integer(),
		createdAt: now,
		oauth: joi.object().keys({
			google: OauthSchema,
			facebook: OauthSchema,
		}).or('google', 'facebook').required(),
		restream: {
			youtube: arrayOfUniqueObjectIds,
			facebook: arrayOfUniqueObjectIds,
		},
		channels: joi
			.array()
			.items(ChannelSchema)
			.default([])
			.unique((a, b) => a.lowercaseName === b.lowercaseName),
	});

	const validate = obj => UserSchema.validate({ ...obj, version }, { allowUnknown: true });

	return {
		validate,
	};
};
