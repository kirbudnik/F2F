// Add settings object to both the user object and the channels objects

module.exports = ({ _, joi, utils, prevVer }) => {
	const version = 2;

	const {
		now,
		optionalString,
		objectIdType,
		arrayOfUniqueObjectIds,
		defaultFalse,
		defaultTrue,
	} = utils;

	const SettingsSchema = joi.object().keys({
		isAutoJoinOn: defaultFalse,
		isViewerCountOn: defaultTrue,
		isQueueSoundOn: defaultTrue,
	}).default();

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
		settings: SettingsSchema,
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
		settings: SettingsSchema,
	});


	const validate = obj => UserSchema.validate({ ...obj, version }, { allowUnknown: true });

	const forwards = user => validate(user);

	const backwards = user => prevVer.validate({
		..._.omit(user, 'settings'),
		channels: user.channels.map(c => _.omit(c, 'settings')),
	});


	return {
		validate,
		forwards,
		backwards,
	};
};
