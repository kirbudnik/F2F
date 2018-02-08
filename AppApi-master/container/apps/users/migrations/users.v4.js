// Add email field at top level
// Make some oauth fields mandatory

module.exports = ({ _, joi, utils, prevVer }) => {
	const version = 4;

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
		isPayBtnOn: defaultTrue,
	}).default();

	const OauthSchema = joi.object().keys({
		platformId: joi.string().required(),
		email: joi.string().required(),
		emailVerified: joi.boolean().required(),
		name: joi.string().required(),
		firstName: optionalString,
		accessToken: joi.string().required(),
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
		email: joi.string().required(),
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
		pay: joi.object().keys({
			isApproved: defaultFalse,
			hasApplied: defaultFalse,
			isStripeConnected: defaultFalse,
			currency: joi.string().valid(['usd']).default('usd'),
			btnColor: joi.string().default('#ff9700'),
			btnText: joi.string().default('').allow(''),
			descriptionText: joi.string().default('').allow(''),
			isCustomAmountOn: defaultTrue,
			presetAmounts: joi.array().items(
				joi.number().integer().min(0),
			).length(3).default([500, 1000, 3000]),
			btnLocations: joi.object().keys({
				channel: defaultTrue,
				profile: defaultTrue,
			}).default(),
		}).default(),
		stripe: joi.object().keys({
			platformId: joi.string().required(),
			linkedAt: now,
		}),
	});


	const validate = obj => UserSchema.validate({ ...obj, version }, { allowUnknown: true });

	const forwards = user => validate({
		...user,
		email: Object.values(user.oauth).reduce((email, obj) => obj.email || email, null),
	});

	const backwards = user => prevVer.validate({
		..._.omit(user, 'email'),
	});


	return {
		validate,
		forwards,
		backwards,
	};
};
