const wrap = promise => promise
	.then(data => [null, data])
	.catch(err => [err]);


module.exports = ({ model, select, logger, usersController, broadcastsController }) => {
	async function updateDiscover() {
		let err;
		let broadcastIds;
		let users;

		[err, broadcastIds] = await wrap(broadcastsController.getLiveBroadcastIds());
		if (err) {
			logger.error('Discover all broadcast ids', err);
			return;
		}

		[err, users] = await wrap(usersController.getUsersWithChannels({ limit: 1000 }));
		if (err) {
			logger.error('Discover users with channels', err);
			return;
		}

		const discoverables = select.chooseDiscoverables(users, broadcastIds);

		[err] = await wrap(model.setChannels(discoverables));
		if (err) {
			logger.error('Set discoverables', err);
			return;
		}

		logger.log('Updated discovery. Length:', discoverables.length);
	}

	async function getChannels(req, res) {
		let err;
		let channels;

		[err, channels] = await wrap(model.getChannels());
		if (err) {
			logger.error('Discover channels', err);
			return res.sendStatus(500);
		}

		if (!channels || channels.length === 0) {
			await wrap(updateDiscover());

			[err, channels] = await wrap(model.getChannels());
			if (err) {
				logger.error('Discover channels', err);
				return res.sendStatus(500);
			}
		}

		return res.json({ channels });
	}


	return { getChannels };
};
