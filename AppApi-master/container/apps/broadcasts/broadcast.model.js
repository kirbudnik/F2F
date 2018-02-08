const KEEP_ALIVE_EXT = 45;

module.exports = (redis) => {
	function parseJson(str) {
		try {
			return JSON.parse(str);
		} catch (err) {
			return null;
		}
	}

	// Returns null if key doesn't exist
	const getBroadcast = broadcastId => redis.hgetallAsync(`broadcast:${broadcastId}`);

	const addChatComment = ({ broadcastId, comment }) =>
		redis.lpushAsync(`broadcast:${broadcastId}:chat`, JSON.stringify(comment));

	const getChatComments = ({ broadcastId, start, end }) =>
		redis
			.lrangeAsync(`broadcast:${broadcastId}:chat`, start, end)
			.then(comments => comments.map(json => parseJson(json)));

	const setLayout = ({ broadcastId, layout }) =>
		redis.hsetAsync(`broadcast:${broadcastId}`, 'layout', layout);

	const setLive = broadcastId =>
		redis.multi([
			['hset', `broadcast:${broadcastId}`, 'isLive', true],
			['sadd', 'broadcasts:live', broadcastId],
			['srem', 'broadcasts:dead', broadcastId],
		]);

	const toggleSettings = (broadcastId, settings) =>
		redis.hmsetAsync(`broadcast:${broadcastId}`, settings);

	const createBroadcast = args =>
		redis.multi([
			['hmset', `broadcast:${args.id}`, args],
			['set', `broadcast:${args.id}:alive`, 'true', 'EX', KEEP_ALIVE_EXT],
			['sadd', 'broadcasts', args.id],
			['sadd', 'broadcasts:dead', args.id],
		]);

	const deleteBroadcast = broadcastId =>
		redis.multi([
			['del', `broadcast:${broadcastId}`],
			['del', `broadcast:${broadcastId}:alive`],
			['del', `broadcast:${broadcastId}:bubbles`],
			['del', `broadcast:${broadcastId}:chat`],
			['srem', 'broadcasts', broadcastId],
			['srem', 'broadcasts:live', broadcastId],
			['srem', 'broadcasts:dead', broadcastId],
		]);

	const getAllBroadcastIds = () => redis.smembersAsync('broadcasts');

	const getLiveBroadcastIds = () => redis.smembersAsync('broadcasts:live');


	const keepBroadcastAlive = id =>
		redis
			.setAsync([`broadcast:${id}:alive`, 'true', 'EX', KEEP_ALIVE_EXT]);


	const getAllBroadcastKeepAlives = ids =>
		redis
			.multi(ids.map(id => ['get', `broadcast:${id}:alive`]));

	const getVideoRoomId = id =>
		redis
			.hgetAsync(`broadcast:${id}`, 'videoRoomId');

	const getBubble = ({ broadcastId, clientId }) =>
		redis.hgetAsync(`broadcast:${broadcastId}:bubbles`, clientId);

	const setBubble = ({ broadcastId, clientId, imgSrc }) =>
		redis.hsetAsync(`broadcast:${broadcastId}:bubbles`, clientId, imgSrc);

	const deleteBubble = ({ broadcastId, clientId }) =>
		redis.delAsync(`broadcast:${broadcastId}:bubbles`, clientId);


	return {
		getBroadcast,
		addChatComment,
		getChatComments,
		setLayout,
		setLive,
		toggleSettings,
		createBroadcast,
		deleteBroadcast,
		getAllBroadcastIds,
		getLiveBroadcastIds,
		keepBroadcastAlive,
		getAllBroadcastKeepAlives,
		getVideoRoomId,
		getBubble,
		setBubble,
		deleteBubble,
	};
};
