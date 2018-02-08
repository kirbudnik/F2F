module.exports = ({
	config,
	logger,
	helpers,
	messages,
	requests,
	// requestErrors,
	model,
	usersController,
}) => {
	const { f2fRoles, DEFAULT_LAYOUT } = config;
	const {
		wrap,
		newUnlistedBroadcastId,
		randomBroadcastName,
		isValidBroadcastId,
		isValidUnlistedBroadcastName,
		isUnlistedBroadcastId,
		channelFromBroadcastId,
		isValidVideoRoomId,
		isValidBase64Img,
		isValidChatText,
		// isValidHexColor,
		isValidLayout,
		newF2fToken,
		newClientId,
		// clientChatColor,
		newCommentId,
		isAllBools,
		hasOnlyTheseKeys,
		hasAnyOfTheseKeys,
		isHexColor,
	} = helpers;


	function getBroadcast(req, res) {
		res.json(req.broadcast);
	}


	function joinBroadcast(req, res) {
		// This endpoint will be hit a lot as clients sitting on a channel page
		// are continually checking to see if the broadcast is alive. Simply return
		// no data if the broadcast doesn't exist or this user is restricted from
		// seeing it for now
		if (
				!req.broadcast ||
				!req.broadcast.videoRoomId ||
				(!req.broadcast.isLive && !req.isHost)) {
			res.sendStatus(204);
			return;
		}

		const { videoRoomId } = req.broadcast;
		const clientId = newClientId(req.sessionId);
		const role = req.isHost ? f2fRoles.MODERATOR : f2fRoles.STUDENT;

		const token = newF2fToken({
			clientId,
			role,
			roomId: videoRoomId,
			username: req.isAuth ? req.user.username : 'Anon',
		});

		res.json({
			token,
			clientId,
			videoRoomId,
			isHost: req.isHost,
			broadcast: req.broadcast,
		});
	}


	async function createBroadcast(req, res) {
		let err;
		let body;
		let broadcast;
		let broadcastId;
		let broadcastSettings;
		const { channelName, broadcastName } = req.body;
		const isUnlisted = Boolean(req.body.isUnlisted);
		const { user } = req;

		if (isUnlisted) {
			if (isValidUnlistedBroadcastName(broadcastName)) {
				broadcastId = newUnlistedBroadcastId(
					user.lowercaseUsername,
					broadcastName,
				);
			} else if (!broadcastName) {
				// No name passed in. Generate a random name.
				broadcastId = newUnlistedBroadcastId(
					user.lowercaseUsername,
					randomBroadcastName(),
				);
			} else {
				return res.sendStatus(400);
			}
			broadcastSettings = user.settings;
		} else {
			const channel = user.channels
				.filter(({ lowercaseName }) => lowercaseName === channelName.toLowerCase())[0];

			if (!channel) {
				return res.sendStatus(404);
			}

			broadcastId = `${user.lowercaseUsername}.${channel.lowercaseName}`;
			broadcastSettings = channel.settings;
		}

		// Return success if broadcast is already running
		[err, broadcast] = await wrap(model.getBroadcast(broadcastId));
		if (err) {
			logger.error('Get broadcast', err);
			return res.sendStatus(500);
		}
		if (broadcast) {
			return res.json(broadcast);
		}

		// Create a video room
		[err, body] = await wrap(requests.createRoom());
		if (err) {
			logger.error('Create broadcast', err);
			return res.sendStatus(500);
		}
		if (!isValidVideoRoomId(body.roomId)) {
			logger.log('Invalid roomId from video stack');
			return res.sendStatus(502);
		}

		// Define and save the broadcast hash
		broadcast = {
			isUnlisted,
			id: broadcastId,
			hostUsername: user.username,
			layout: DEFAULT_LAYOUT,
			isLive: false,
			videoRoomId: body.roomId,
			...broadcastSettings,
		};

		[err] = await wrap(model.createBroadcast(broadcast));
		if (err) {
			logger.error('Create broadcast', err);
			return res.sendStatus(500);
		}

		// Asynchronously increment this users broadcast count
		usersController.incrBroadcastCount({ user })
			.then((updatedUser) => {
				logger.event('startBroadcast', {
					userId: String(user._id),
					broadcastCount: updatedUser.broadcastCount,
				});
			})
			.catch(error => logger.error('Incr broadcast count', error));

		return res.status(201).json(broadcast);
	}


	function endBroadcast(req, res) {
		if (!req.broadcast) {
			return res.sendStatus(200);
		}
		// Put isHost check after broadcast existance check.
		if (!req.isHost) {
			return res.sendStatus(401);
		}

		return model.deleteBroadcast(req.broadcast.id)
			.then(() => {
				requests.roomMessage(req.broadcast.videoRoomId, messages.dead())
					.catch(err => logger.error('End broadcast msg', err));
				// Successful as long as db was cleaned up
				res.sendStatus(200);
			})
			.catch((err) => {
				logger.error('End broadcast', err);
				res.sendStatus(500);
			});
	}


	function goLive(req, res) {
		// Shoot a realtime message before changing the db. Host may have multiple
		// tabs/devices on the page and they should all go live simultaneously
		requests.roomMessage(req.broadcast.videoRoomId, messages.live())
			.then(() => model.setLive(req.broadcast.id))
			.then(() => {
				res.sendStatus(200);
			})
			.catch((err) => {
				logger.error('Go live', err);
				res.sendStatus(500);
			});
	}


	const settingsDisabledWhenLive = [];
	const settingsKeys = ['isViewerCountOn', 'isAutoJoinOn', 'isQueueSoundOn', 'isPayBtnOn'];

	async function changeSettings(req, res) {
		let err;
		const { settings } = req.body;
		const { broadcast } = req;
		const isUnlisted = isUnlistedBroadcastId(broadcast.id);
		const channelName = channelFromBroadcastId(broadcast.id);

		// Ensure all keys are valid settings
		if (!hasOnlyTheseKeys(settings, settingsKeys) || !isAllBools(settings)) {
			return res.sendStatus(400);
		}

		// Certain settings cannot be toggled while live
		if (broadcast.islive && hasAnyOfTheseKeys(settings, settingsDisabledWhenLive)) {
			return res.sendStatus(409);
		}

		[err] = await wrap(model.toggleSettings(broadcast.id, settings));
		if (err) {
			logger.error('Toggle broadcast setting', err);
			return res.sendStatus(500);
		}

		usersController.toggleBroadcastSettings({
			settings,
			user: req.user,
			channelName: isUnlisted ? null : channelName,
		})
			.catch((error) => {
				logger.error('Toggle user broadcast setting', error);
			});

		if (broadcast.videoRoomId) {
			[err] = await wrap(requests.roomMessage(
				broadcast.videoRoomId,
				messages.settings(settings)),
			);
			if (err) {
				return res.sendStatus(500);
			}
		}

		// If we made it here then all settings updated successfully
		return res.sendStatus(200);
	}


	function setLayout(req, res) {
		const { layout } = req.body;

		if (!isValidLayout(layout)) {
			return res.sendStatus(400);
		}
		if (layout === req.broadcast.layout) {
			return res.sendStatus(200);
		}

		return model.setLayout({ layout, broadcastId: req.broadcast.id })
			.then(() =>
				requests.roomMessage(
					req.broadcast.videoRoomId,
					messages.layout(layout),
				),
			)
			.then(() => {
				res.sendStatus(200);
			})
			.catch((err) => {
				logger.error('Set layout', err);
				res.sendStatus(500);
			});
	}


	function getBubble(req, res) {
		const { broadcastId, clientId } = req.params;

		model.getBubble({ broadcastId, clientId })
			.then((imgSrc) => {
				if (imgSrc) {
					res.json({ imgSrc });
				} else {
					res.sendStatus(404);
				}
			})
			.catch((err) => {
				logger.error('Get bubble', err);
				res.sendStatus(500);
			});
	}


	function setBubble(req, res) {
		const { broadcastId, clientId } = req.params;
		const { imgSrc } = req.body;

		if (!isValidBase64Img(imgSrc)) {
			return res.sendStatus(400);
		}

		return model.setBubble({ broadcastId, clientId, imgSrc })
			.then(() => res.sendStatus(201))
			.catch((err) => {
				logger.error('Set bubble', err);
				res.sendStatus(500);
			});
	}

	function deleteBubble(req, res) {
		const { broadcastId, clientId } = req.params;

		model.deleteBubble({ broadcastId, clientId })
			.then(() => res.sendStatus(200))
			.catch((err) => {
				logger.error('Delete bubble', err);
				res.sendStatus(500);
			});
	}


	function addChatComment(req, res) {
		const { broadcastId } = req.params;
		const { text, color } = req.body;

		if (!isValidChatText(text) || (!isHexColor(color) && color !== undefined)) {
			return res.sendStatus(400);
		}
		const comment = {
			text,
			color: color || '#CECECE',
			username: req.user.username,
			id: newCommentId(),
		};

		return model.addChatComment({ broadcastId, comment })
			.then(() =>
				requests.roomMessage(req.broadcast.videoRoomId, messages.chat(comment)),
			)
			.then(() => {
				res.json(comment);
			})
			.catch((err) => {
				logger.error('Chat', err);
				res.sendStatus(500);
			});
	}


	function getChatComments(req, res) {
		const { broadcastId } = req.params;
		// TODO - Ability to pull any range of comments
		const start = 0;
		const end = 30;

		model.getChatComments({ broadcastId, start, end })
			.then((comments) => {
				res.json({ broadcastId, comments, start, end });
			})
			.catch((err) => {
				logger.error('Get chat', err);
				res.sendStatus(500);
			});
	}


	function reportJoinFail(req, res) {
		// TODO
		res.sendStatus(200);
		// requests.pingRoom(req.broadcast.videoRoomId)
		// 	.then(() => {
		// 		// Video stack says the room exists. Client should retry.
		// 		res.sendStatus(200);
		// 	})
		// 	.catch(requestErrors.StatusCodeError, (err) => {
		// 		logger.log('Video room ping', err.statusCode);
		// 		if (err.statusCode === 404) {
		// 			// Room doesn't exist on video stack
		// 			// TODO - This should probably recreate the broacast
		// 			model.deleteBroadcast(req.broadcast.id)
		// 				.catch(error => logger.error('Delete broadcast', error));
		// 		}
		// 		res.sendStatus(200);
		// 	})
		// 	.catch((err) => {
		// 		logger.error('Video room ping', err);
		// 		res.sendStatus(500);
		// 	});
	}


	function keepBroadcastAlive(req, res) {
		model.keepBroadcastAlive(req.broadcast.id)
			.then(() => {
				res.sendStatus(200);
			})
			.catch((err) => {
				logger.error('Keep alive', err);
				res.sendStatus(500);
			});
	}


	// Functions exposed to other apps locally
	function payNotification(req) {
		const { broadcastId, amount, currency, username } = req;

		if (!isValidBroadcastId(broadcastId)) {
			return;
		}

		model.getBroadcast(broadcastId)
			.then((broadcast) => {
				if (broadcast && broadcast.videoRoomId) {
					requests.roomMessage(
						broadcast.videoRoomId,
						messages.pay({ amount, currency, username }),
					)
						.catch((err) => {
							logger.log('Send pay message', err);
						});
				}
			})
			.catch((err) => {
				logger.log('Get broadcast', err);
			});
	}

	function getLiveBroadcastIds() {
		return model.getLiveBroadcastIds();
	}


	async function checkForDeaths() {
		let err;
		let ids;
		let isAlives;
		let broadcast;

		[err, ids] = await wrap(model.getAllBroadcastIds());
		if (err) {
			logger.error('Sweeper', err);
			return;
		}

		[err, isAlives] = await wrap(model.getAllBroadcastKeepAlives(ids));
		if (err) {
			logger.error('Sweeper', err);
			return;
		}

		const toKill = ids.filter((id, i) => !isAlives[i]);

		// We should iterate over these individually. Don't wait a single failure to stop
		// another from executing.
		toKill.forEach(async (id) => {
			[err, broadcast] = await wrap(model.getBroadcast(id));

			[err] = await wrap(model.deleteBroadcast(id));
			if (err) {
				logger.error('Sweeper', err);
				return;
			}
			if (broadcast) {
				[err] = await wrap(requests.roomMessage(broadcast.videoRoomId, messages.dead()));
				if (err) {
					logger.error('End broadcast msg', err);
				}
			}
			logger.log(id, 'was swept');
		});
	}

	setInterval(checkForDeaths, 10 * 1000);

	return {
		getBroadcast,
		joinBroadcast,
		createBroadcast,
		endBroadcast,
		goLive,
		changeSettings,
		getBubble,
		setBubble,
		deleteBubble,
		addChatComment,
		getChatComments,
		setLayout,
		reportJoinFail,
		keepBroadcastAlive,
		payNotification,
		getLiveBroadcastIds,
	};
};
