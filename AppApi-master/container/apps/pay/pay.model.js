module.exports = ({ mongo, joi, logger }) => {
	// Mongo
	const payments = () => mongo.db().collection('payments');
	const { objectId } = mongo;


	// Joi
	const now = joi.number().integer().default(() => Math.floor(new Date() / 1000), 'Now');
	const optionalString = joi.string().allow('', null);
	const objectIdType = joi.object().type(objectId);


	// Indexes
	mongo.onConnect(() => {
		payments().createIndex({ receiver: 1 })
			.catch(err => logger.error('Indexing payment receiver', err));

		// payments().find().toArray().then(pays => console.log(pays));
	});


	// Schema
	const TransactionSchema = joi.object().keys({
		_id: objectIdType,
		amount: joi.number().integer().positive().required(),
		currency: joi.string().valid(['usd']).required(),
		platform: joi.string().valid(['stripe']).required(),
		source: joi.string().valid(['card']).required(),
		chargeId: joi.string().required(),
		destination: joi.string().required(),
		receiver: objectIdType.required(),
		sender: objectIdType,
		senderUsername: optionalString,
		senderEmail: joi.string().required(),
		createdAt: now,
	}).default();


	// Helpers
	function validate(user) {
		if (user) {
			return TransactionSchema.validate(user, { stripUnknown: true });
		}
		return user;
	}

	const validateSave = cb => user =>
		validate(user)
			.then((obj) => {
				if (!obj) {
					throw new Error('Nothing passed to save');
				}
				return obj;
			})
			.then(cb);


	// Queries/Operators
	const findByReceiver = receiver => payments().find({ receiver }).toArray();

	const findByChargeId = chargeId => payments().findOne({ chargeId });

	const save = validateSave(obj =>
		payments().save(obj).then((resp) => {
			if (obj._id) {
				return obj;
			}
			return resp.ops[0];
		}),
	);


	// Static Methods
	const publicData = obj => ({
		id: obj._id,
		amount: obj.amount,
		currency: obj.currency,
		platform: obj.platform,
		source: obj.source,
		receiver: obj.receiver,
		sender: obj.sender,
		senderUsername: obj.senderUsername,
		createdAt: obj.createdAt,
	});


	return {
		findByReceiver,
		findByChargeId,
		save,
		publicData,
	};
};
