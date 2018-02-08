module.exports = ({ model, logger, helpers }) => {
	const { isValidBroadcastId, clientIdContainsSession } = helpers;

	function getHash(req, res, next) {
		const { broadcastId } = req.params;

		if (!isValidBroadcastId(broadcastId)) {
			res.sendStatus(404);
			return;
		}

		model.getBroadcast(broadcastId)
			.then((broadcast) => {
				// Will be a hash or null
				if (broadcast) {
					req.broadcast = broadcast;
					if (req.user.username === broadcast.hostUsername) {
						req.isHost = true;
					} else {
						req.isHost = false;
					}
				} else {
					req.broadcast = null;
					req.isHost = null;
				}
				next();
			})
			.catch((err) => {
				logger.log('Get broadcast', err);
				res.sendStatus(500);
			});
	}

	function hasHash(req, res, next) {
		if (req.broadcast instanceof Object) {
			next();
		} else {
			res.sendStatus(404);
		}
	}

	function isHost(req, res, next) {
		if (req.isHost) {
			next();
		} else {
			res.sendStatus(401);
		}
	}

	// User must own this client id
	function isUs(req, res, next) {
		if (clientIdContainsSession(req.sessionId, req.params.clientId)) {
			next();
		} else {
			res.sendStatus(401);
		}
	}

	// User must either be the host for this broadcast or own the clientId
	function isUsOrHost(req, res, next) {
		if (req.isHost || clientIdContainsSession(req.sessionId, req.params.clientId)) {
			next();
		} else {
			res.sendStatus(401);
		}
	}

	function isLive(req, res, next) {
		if (req.broadcast.isLive) {
			next();
		} else {
			res.sendStatus(409);
		}
	}

	function hasVideo(req, res, next) {
		if (req.broadcast.videoRoomId) {
			next();
		} else {
			res.sendStatus(409);
		}
	}

	return {
		getHash,
		hasHash,
		isHost,
		isUs,
		isUsOrHost,
		isLive,
		hasVideo,
	};
};
