module.exports = ({ config, helpers, model, logger, oauth }) => {
	const { DEBUG } = config;

	const {
		wrap,
		dumpToS3,
		imgPath,
		cacheBust,
		csrfHash,
		isLoginPlatform,
		isValidUsername,
		isValidChannelName,
		isValidAboutText,
		decodeSignupToken,
		getRefCodeFromCookies,
		newSignupToken,
	} = helpers;


	function auth(req, res) {
		if (!req.isAuth) {
			res.json({ isAuth: false });
		} else {
			res.json({ ...model.privateUserDataWithChannels(req.user), isAuth: true });
		}
	}


	function getUser(req, res) {
		const { username } = req.params;

		if (!isValidUsername(username)) {
			return res.sendStatus(404);
		}

		return model.findByUsername(username)
			.then((user) => {
				if (user) {
					res.json({
						...model.publicUserDataWithChannels(user),
						isOwner: String(req.user._id) === String(user._id),
						paymentEnabled: (user.stripe instanceof Object && ('stripe_user_id' in user.stripe)),
					});
				} else {
					res.sendStatus(404);
				}
			})
			.catch((err) => {
				logger.error('Get user', err);
				res.sendStatus(500);
			});
	}


	function getChannel(req, res) {
		const { username, channelName } = req.params;

		if (!isValidUsername(username)) {
			res.sendStatus(404);
			return;
		}
		if (!isValidChannelName(channelName)) {
			res.sendStatus(404);
			return;
		}

		model.findByUsername(username)
			.then((user) => {
				if (user && model.getChannel(user, channelName)) {
					res.json({
						...model.publicChannelDataWithOwner(user, channelName),
						isOwner: String(req.user._id) === String(user._id),
						paymentEnabled: (user.stripe instanceof Object && ('stripe_user_id' in user.stripe)),
					});
				} else {
					res.sendStatus(404);
				}
			})
			.catch((err) => {
				logger.error('Get channel', err);
				res.sendStatus(500);
			});
	}


	// Redirect the user to 3rd party to login
	function getLoginRedirect(req, res) {
		const { platform } = req.params;

		if (!isLoginPlatform(platform)) {
			return res.sendStatus(400);
		}

		const redirectUrl = oauth[platform].redirectUrl({
			state: `login.${csrfHash(req.cookies.csrfToken)}`,
			isPublisher: false,
		});

		return res.json({ redirectUrl });
	}


	async function login(req, res) {
		let err;
		let decoded;
		let user;
		const { code, state } = req.body;
		const { platform } = req.params;

		if (!isLoginPlatform(platform) || typeof code !== 'string' || typeof state !== 'string') {
			return res.sendStatus(400);
		}
		if (state !== `login.${csrfHash(req.cookies.csrfToken)}`) {
			return res.sendStatus(403);
		}

		[err, decoded] = await wrap(oauth[platform].exchangeCodeForToken(code));
		if (err) {
			logger.error('Login token', platform, code, err);
			if (err.message === 'PermissionsDenied') {
				// Return a unique status code if the user denied access to their data.
				return res.sendStatus(409);
			}
			return res.sendStatus(500);
		}

		const { platformId } = decoded;

		[err, user] = await wrap(model.findByPlatformId(platform, platformId));
		if (err) {
			logger.error('Find user by platform id', err);
			return res.sendStatus(500);
		}

		if (user) {
			// Existing user. Ensure data is up to date.
			user.oauth[platform] = {
				...user.oauth[platform],
				...decoded,
			};
			user.email = decoded.email;

			[err, user] = await wrap(model.save(user));
			if (err) {
				logger.error('Save oauth platform', err);
				return res.sendStatus(500);
			}
		} else {
			// First time logging in. Create new user
			const refCode = getRefCodeFromCookies(req.cookies);

			user = {
				refCode,
				email: decoded.email,
				oauth: {
					[platform]: decoded,
				},
			};

			[err, user] = await wrap(model.save(user));
			if (err) {
				logger.error('Create user', err);
				return res.sendStatus(500);
			}

			logger.log('New user signup. Ref code:', refCode);
			logger.event('signup', {
				userId: String(user._id),
				email: decoded.email,
				firstName: decoded.firstName,
				...(refCode && { refCode }),
			});
		}

		if (user.username) {
			logger.log('Existing user login', user.username);
			req.login(user);
			return res.sendStatus(200);
		}

		return res.json({
			signupToken: newSignupToken(user._id, req.cookies.csrfToken),
		});
	}


	function usernameAvailability(req, res) {
		const { username } = req.params;
		if (!isValidUsername(username)) {
			res.json({ isAvailable: false });
			return;
		}
		model.findByUsername(username)
			.then((user) => {
				if (user) {
					res.json({ isAvailable: false });
				} else {
					res.json({ isAvailable: true });
				}
			})
			.catch((err) => {
				logger.error(err);
				res.sendStatus(500);
			});
	}


	async function setUsername(req, res) {
		let err;
		let decoded;
		let existingUser;
		let user;
		const { signupToken, username } = req.body;

		if (!isValidUsername(username)) {
			return res.sendStatus(400);
		}

		// Ensure the csrf token in the signup cookie matches our actual cookie
		[err, decoded] = await wrap(decodeSignupToken(signupToken, req.cookies.csrfToken));
		if (err) {
			return res.sendStatus(403);
		}

		const { userId } = decoded;

		[err, user] = await wrap(model.findById(userId));
		if (err) {
			logger.log('Find user by id', err);
			return res.sendStatus(500);
		}
		if (!user) {
			return res.sendStatus(400);
		}
		if (user.username) {
			// User already has a username
			return res.sendStatus(409);
		}

		// Check if name is available
		[err, existingUser] = await wrap(model.findByUsername(username));
		if (err) {
			logger.log('Find user by username', err);
			return res.sendStatus(500);
		}
		if (existingUser) {
			// Username is taken
			return res.sendStatus(409);
		}

		// 'lowercaseUsername' is indexed. This only succeeds if it is unique
		user.username = username;
		user.lowercaseUsername = username.toLowerCase();

		[err, user] = await wrap(model.save(user));
		if (err) {
			logger.error('Set username', err);
			return res.sendStatus(500);
		}

		logger.event('setUsername', { username, userId: String(user._id) });
		logger.log('New user created', username);

		req.login(user);
		return res.status(201).json(model.publicUserDataWithChannels(user));
	}


	function createChannel(req, res) {
		const { user } = req;
		const { channelName } = req.body;

		if (!isValidChannelName(channelName)) {
			return res.sendStatus(400);
		}
		if (model.getChannel(user, channelName)) {
			return res.sendStatus(409);
		}
		if (user.channels.length >= 30) {
			// User has too many channels
			return res.sendStatus(402);
		}

		user.channels.push({
			name: channelName,
			lowercaseName: channelName.toLowerCase(),
		});
		user.version = 3;

		return model.save(user)
			.then(() => {
				logger.log('Created channel', user.username, channelName);
				res.json(model.publicChannelDataWithOwner(user, channelName));
			})
			.catch((err) => {
				logger.error('Create channel', err);
				res.sendStatus(500);
			});
	}


	function deleteChannel(req, res) {
		const { channelName } = req.params;
		const { user } = req;

		if (!model.getChannel(user, channelName)) {
			// Success if not found. This is a delete request
			return res.json(model.publicUserDataWithChannels(user));
		}

		user.channels = user.channels
			.filter(({ lowercaseName }) => lowercaseName !== channelName.toLowerCase());

		return model.save(user)
			.then(() => {
				res.json(model.publicUserDataWithChannels(user));
			})
			.catch((err) => {
				logger.error('Delete channel', err);
				res.sendStatus(500);
			});
	}


	const setAbout = () => (req, res) => {
		const { channelName } = req.params;
		const { text } = req.body;
		const { user } = req;

		if (!isValidAboutText(text)) {
			return res.sendStatus(400);
		}

		if (channelName) {
			const channel = model.getChannel(user, channelName);
			channel.about = text;
		} else {
			user.about = text;
		}

		return model.save(user)
			.then(() => {
				res.json(channelName
					? model.publicChannelDataWithOwner(user, channelName)
					: model.publicUserDataWithChannels(user),
				);
			})
			.catch((err) => {
				logger.error('Save about', err);
				res.sendStatus(500);
			});
	};


	const setUserAbout = setAbout();
	const setChannelAbout = setAbout();


	const uploadImg = (fileName, key) => (req, res) => {
		const user = req.user;
		const channelName = req.params.channelName;

		const path = imgPath({
			channelName,
			fileName,
			userId: req.user._id,
			fileType: req.image.type,
		});

		// Save path to db with a cache bust query param
		const url = path + cacheBust();

		dumpToS3(path, req.image.buffer)
			.then(() => {
				if (channelName) {
					const channel = model.getChannel(user, channelName);
					channel[key] = url;
				} else {
					user[key] = url;
				}
				return model.save(user);
			})
			.then(() => {
				res.json(channelName
					? model.publicChannelDataWithOwner(user, channelName)
					: model.publicUserDataWithChannels(user),
				);
			})
			.catch((err) => {
				logger.error('Upload image', err);
				res.sendStatus(500);
			});
	};


	const uploadUserAvatar = uploadImg('avatar', 'avatarSrc');
	const uploadUserCover = uploadImg('cover', 'coverSrc');
	const uploadChannelAvatar = uploadImg('avatar', 'avatarSrc');
	const uploadChannelCover = uploadImg('cover', 'coverSrc');


	// These methods are only being called by other apps locally
	function incrBroadcastCount(req) {
		const { user } = req;

		if (Number.isInteger(user.broadcastCount)) {
			user.broadcastCount += 1;
		} else {
			user.broadcastCount = 1;
		}
		user.lastBroadcast = Math.floor(new Date() / 1000);

		return model.save(user);
	}


	function toggleBroadcastSettings(req) {
		const { user, channelName, settings } = req;

		if (channelName) {
			const channel = model.getChannel(user, channelName);

			if (channel) {
				channel.settings = {
					...channel.settings,
					...settings,
				};
			}
		} else {
			user.settings = {
				...user.settings,
				...settings,
			};
		}

		return model.save(user);
	}


	// Must return a promise
	async function addRestreamPlatform(req) {
		const { user, platform, id } = req;

		if (!(user.restream instanceof Object)) {
			user.restream = {};
		}
		if (!Array.isArray(user.restream[platform])) {
			user.restream[platform] = [];
		}

		// Don't add this id if we already have it
		if (user.restream[platform].filter(existingId => id.equals(existingId)).length === 0) {
			user.restream[platform].push(id);
			return model.save(user);
		}
		return user;
	}


	function linkStripe(req) {
		const { user, platformId } = req;

		user.pay.isStripeConnected = true;
		user.stripe = {
			platformId,
			linkedAt: Math.floor(new Date() / 1000),
		};

		return model.save(user);
	}


	function unlinkStripe(req) {
		const { user } = req;

		user.pay.isStripeConnected = false;
		if (user.stripe) {
			delete user.stripe;
		}

		return model.save(user);
	}


	function togglePaySettings(req) {
		const { user, settings } = req;

		user.pay = {
			...user.pay,
			...settings,
		};

		return model.save(user);
	}


	const findByUsername = req => model.findByUsername(req.username);


	function appliedForPay(req) {
		const { user } = req;

		user.pay.hasApplied = true;
		if (DEBUG) {
			user.pay.isApproved = true;
		}
		return model.save(user);
	}


	function getUsersWithChannels(req) {
		return model.findManyRandom({ channels: { $exists: true, $ne: [] } }, req.limit);
	}


	return {
		auth,
		getUser,
		getChannel,
		getLoginRedirect,
		login,
		usernameAvailability,
		setUsername,
		setUserAbout,
		uploadUserAvatar,
		uploadUserCover,
		createChannel,
		setChannelAbout,
		uploadChannelAvatar,
		uploadChannelCover,
		deleteChannel,
		incrBroadcastCount,
		toggleBroadcastSettings,
		addRestreamPlatform,
		linkStripe,
		unlinkStripe,
		togglePaySettings,
		findByUsername,
		appliedForPay,
		getUsersWithChannels,
	};
};
