module.exports = ({ mongo, config, logger, migrations }) => {
	const { S3_BUCKET_PATH } = config;


	// Mongo
	const { objectId } = mongo;
	const { curVersion } = migrations;
	const users = () => mongo.db().collection('users');
	const migrate = (user) => {
		if (!user) {
			// Don't run migration if user is not found
			return user;
		}
		return migrations.fromTo((user && user.version) || curVersion, curVersion, user);
	};


	// Queries
	const findOne = query =>
		users()
			.findOne(query)
			.then(migrate);

	const findById = userId =>
		findOne({ _id: objectId(userId) });

	const findByUsername = username =>
		findOne({ lowercaseUsername: username.toLowerCase() });

	const findByPlatformId = (platform, platformId) =>
		findOne({ [`oauth.${platform}.platformId`]: platformId });

	const findMany = (query, limit = 10) =>
		users()
			.find(query)
			.limit(limit)
			.toArray()
			.then(arr => Promise.all(arr.map(migrate)));

	const findManyRandom = (query, limit = 10) =>
		users()
			.aggregate([
				{ $match: query },
				{ $sample: { size: limit } },
			])
			.toArray()
			.then(arr => Promise.all(arr.map(migrate)));


	// Modifications
	const save = obj => migrate(obj)
		.then(user => users().save(user)
			.then((resp) => {
				if (user._id) {
					// Existing user was saved
					return user;
				}
				// Inserted a new user
				return resp.ops[0];
			}),
		);


	// Helpers
	function addBucketPath(img) {
		if (typeof img === 'string') {
			return `${S3_BUCKET_PATH}/${img}`;
		}
		return img;
	}

	// Data than anyone can see
	const publicUser = user => ({
		id: user._id,
		username: user.username,
		lowercaseName: user.lowercaseUsername,
		about: user.about,
		avatarSrc: addBucketPath(user.avatarSrc),
		coverSrc: addBucketPath(user.coverSrc),
		settings: user.settings,
		pay: user.pay,
	});

	// Data that should only be shown to the user themselves
	const privateUser = user => ({
		...publicUser(user),
		email: user.email,
		refCode: user.refCode,
		lastBroadcast: user.lastBroadcast,
		broadcastCount: user.broadcastCount,
	});

	const publicChannel = channel => ({
		name: channel.name,
		lowercaseName: channel.lowercaseName,
		about: channel.about,
		avatarSrc: addBucketPath(channel.avatarSrc),
		coverSrc: addBucketPath(channel.coverSrc),
		settings: channel.settings,
	});


	// Static methods
	function getChannel(user, channelName) {
		if (!Array.isArray(user.channels)) {
			return null;
		}
		return user.channels.filter(
			({ lowercaseName }) => lowercaseName === channelName.toLowerCase(),
		)[0] || null;
	}

	const publicUserDataWithChannels = user => ({
		...publicUser(user),
		channels: user.channels.map(channel => publicChannel(channel)),
	});

	const privateUserDataWithChannels = user => ({
		...privateUser(user),
		channels: user.channels.map(channel => publicChannel(channel)),
	});

	function publicChannelDataWithOwner(user, channelName) {
		const channel = getChannel(user, channelName);

		if (!channel) {
			return {};
		}
		return {
			...publicChannel(channel),
			owner: publicUser(user),
		};
	}


	// Indexes
	mongo.onConnect(() => {
		// Ensure usernames are unique
		users().createIndex({ lowercaseUsername: 1 }, { unique: true, sparse: true })
			.catch(err => logger.error('Indexing usernames', err));

		// Ensure platform ids are unique for each oauth provider
		const indexOauth = platform =>
			users().createIndex(
				{ [`oauth.${platform}.platformId`]: 1 },
				{ unique: true, sparse: true },
			)
				.catch(err => logger.error('Index oauth', err));

		indexOauth('google');
		indexOauth('facebook');

		// Constant rolling migration
		setInterval(() => {
			users()
				.find({ version: { $ne: curVersion } })
				.limit(1)
				.toArray()
				.then(arr => Promise.all(arr.map(user => save(user))))
				.then((arr) => {
					if (arr.length > 0) {
						logger.log('Migrated', arr);
					}
				})
				.catch(err => logger.error('User migration', err));
		}, 10 * 1000);

		// users().find().toArray().then(us => us.forEach(u => console.log(u)));
	});


	return {
		findById,
		findByUsername,
		findByPlatformId,
		findMany,
		findManyRandom,
		save,
		getChannel,
		publicUserDataWithChannels,
		privateUserDataWithChannels,
		publicChannelDataWithOwner,
	};
};

