

module.exports = ({ express, middleware, usersMiddleware, controller }) => {
	const { hasValidCookies, isAuth } = usersMiddleware;
	const {
		getHash,
		hasHash,
		isHost,
		isUsOrHost,
		isLive,
		hasVideo,
	} = middleware;
	const {
		createBroadcast,
		endBroadcast,
		getBroadcast,
		joinBroadcast,
		changeSettings,
		goLive,
		addChatComment,
		getChatComments,
		setLayout,
		keepBroadcastAlive,
		getBubble,
		setBubble,
		deleteBubble,
	} = controller;

	const router = express.Router();

	router
		.use(hasValidCookies)
		.post('/', isAuth, createBroadcast)
		.get('/:broadcastId', getHash, hasHash, getBroadcast)
		.delete('/:broadcastId', getHash, endBroadcast)
		.get('/:broadcastId/join', getHash, joinBroadcast)
		.post('/:broadcastId/settings', getHash, hasHash, isHost, changeSettings)
		.post('/:broadcastId/live', getHash, hasHash, isHost, hasVideo, goLive)
		.get('/:broadcastId/chat', getHash, hasHash, getChatComments)
		.post('/:broadcastId/chat', getHash, hasHash, isAuth, hasVideo, addChatComment)
		.post('/:broadcastId/layout', getHash, hasHash, isHost, setLayout)
		.post('/:broadcastId/keepalive', getHash, hasHash, isHost, keepBroadcastAlive)
		.get('/:broadcastId/bubble/:clientId', getHash, hasHash, getBubble)
		.post('/:broadcastId/bubble/:clientId', getHash, hasHash, isLive, isUsOrHost, setBubble)
		.delete('/:broadcastId/bubble/:clientId', getHash, hasHash, isUsOrHost, deleteBubble);

	return router;
};
