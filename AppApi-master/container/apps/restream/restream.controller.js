module.exports = ({ _, model, logger, oauth, helpers, usersController }) => {
	const { isRestreamPlatform, csrfHash, wrap } = helpers;


	// Redirect the user to 3rd party to restream
	function getRedirectUrl(req, res) {
		const { platform } = req.params;

		if (!isRestreamPlatform(platform)) {
			return res.sendStatus(400);
		}

		const redirectUrl = oauth[platform].redirectUrl({
			state: `restream.${csrfHash(req.cookies.csrfToken)}`,
			isPublisher: true,
		});

		return res.json({ redirectUrl });
	}


	async function getRestreamKey(req, res) {
		let err;
		let token;
		let instance;
		let key;
		const { code, state } = req.body;
		const { platform } = req.params;
		const save = model.save(platform);

		if (!isRestreamPlatform(platform)) {
			return res.sendStatus(400);
		}
		if (state !== `restream.${csrfHash(req.cookies.csrfToken)}`) {
			return res.sendStatus(403);
		}

		[err, token] = await wrap(oauth[platform].exchangeCodeForToken(code));
		if (err) {
			logger.error('Get restream token', err);
			return res.sendStatus(500);
		}

		[err, instance] = await wrap(model.findByPlatformId(platform, token.platformId));
		if (err) {
			logger.error('Restream find by platform', err);
			return res.sendStatus(500);
		}

		if (instance) {
			// Update existing entry with most recent oauth data
			instance = {
				...instance,
				...token,
			};

			[err, instance] = await wrap(save(instance));
			if (err) {
				logger.log('Update restream', err);
				return res.sendStatus(500);
			}
		} else {
			// New restream instance
			[err, instance] = await wrap(save(token));
			if (err) {
				logger.log('Create restream', err);
				return res.sendStatus(500);
			}
		}

		// Asynchronously save restream id to user object
		usersController.addRestreamPlatform({
			platform,
			user: req.user,
			id: instance._id,
		})
			.catch(error => logger.log('Add restream to user', error));

		// Make api call to get user stream key
		[err, key] = await wrap(oauth[platform].streamKey(token.accessToken, token.platformId));
		if (err && _.get(err, 'error.error.errors[0].reason') === 'liveStreamingNotEnabled') {
			logger.log(req.user.username, 'needs to enable YouTube live streaming');
			return res.status(409).json({ message: 'liveStreamingNotEnabled' });
		}
		if (err) {
			logger.log('Get stream key', err);
			return res.sendStatus(500);
		}

		return res.json({ key });
	}

	return {
		getRedirectUrl,
		getRestreamKey,
	};
};
