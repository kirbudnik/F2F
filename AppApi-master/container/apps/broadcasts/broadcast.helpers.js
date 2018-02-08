const SESSION_ID_SLICE = 12;


module.exports = ({ config, crypto, jwtLib, uuid, validator, hexColorRegex }) => {
	const {
		F2F_APP_SECRET,
		F2F_TOKEN_EXP,
		MAX_CHAT_TEXT_LEN,
		LAYOUTS,
		CHAT_COLORS,
		RANDOM_NAMES,
		MAX_UNLISTED_BROADCAST_NAME_LEN,
		VULGAR_NAMES,
	} = config;

	const wrap = promise => promise
		.then(data => [null, data])
		.catch(err => [err]);

	function defaultFalse(val) {
		if (val === true || val === 1) {
			return true;
		}
		return false;
	}

	const cryptoRandom = len =>
		crypto.randomBytes(Math.ceil(len * (3 / 4)))
			.toString('base64')
			.slice(0, len)
			.replace(/\+/g, '0')
			.replace(/\//g, '0');


	const randomFrom = arr => arr[Math.floor(Math.random() * arr.length)];


	const newUnlistedBroadcastId = (lowercaseUsername, broadcastName) =>
		`${lowercaseUsername}.-${broadcastName.toLowerCase()}`;


	const randomBroadcastName = () =>
		randomFrom(RANDOM_NAMES) + String(Math.floor(Math.random() * 1000));


	const isValidUnlistedBroadcastName = name =>
		typeof name === 'string' &&
		name.length > 0 &&
		name.length <= MAX_UNLISTED_BROADCAST_NAME_LEN &&
		(/^[-_a-zA-Z0-9]+$/).test(name) &&
		!(VULGAR_NAMES.includes(name));


	function isValidBroadcastId(id) {
		if (typeof id !== 'string') {
			return false;
		}

		const split = id.split('.');

		return (
			split.length === 2 &&
			split[0].length > 0 &&
			split[1].length > 0
		);
	}


	const isPublicBroadcastId = id =>
		isValidBroadcastId(id) &&
		id.split('.')[1].charAt(0) !== '-';

	const isUnlistedBroadcastId = id =>
		isValidBroadcastId(id) &&
		id.split('.')[1].charAt(0) === '-';

	const channelFromBroadcastId = id =>
		id.split('.')[1];


	// We can ensure a user actually owns this client id by matching it with
	// the sessionId in their cookies
	const newClientId = sessionId =>
		`${cryptoRandom(12)}.${sessionId.substr(sessionId.length - SESSION_ID_SLICE)}`;


	const clientIdContainsSession = (sessionId, clientId) => (
		sessionId.substr(sessionId.length - SESSION_ID_SLICE) === clientId.split('.').pop()
	);


	function newF2fToken({ roomId, clientId, username, role }) {
		return jwtLib.sign({
			roomId,
			role,
			clientInfo: JSON.stringify({ clientId, username }),
			maxAge: F2F_TOKEN_EXP,
		}, F2F_APP_SECRET);
	}

	// Room id has a dash in the middle
	function isValidVideoRoomId(roomId) {
		if (typeof roomId !== 'string') {
			return false;
		}
		const [prefix, suffix] = roomId.split('-');
		return (
			prefix.length > 0 &&
			suffix !== undefined &&
			suffix.length > 0
		);
	}

	const isValidChatText = text => (
		typeof text === 'string' &&
		text.length > 0 &&
		text.length <= MAX_CHAT_TEXT_LEN
	);

	const isValidHexColor = hex =>
		typeof hex === 'string' && (/^#(?:[0-9a-fA-F]{3}){1,2}$/).test(hex);

	const isValidLayout = layout => LAYOUTS.includes(layout);


	const isValidBase64Img = str => (
		typeof str === 'string' &&
		str.indexOf('data:image/png;base64,') === 0 &&
		validator.isBase64(str.replace('data:image/png;base64,', ''))
	);

	// Choose a random chat color based on the first character in the client id
	const clientChatColor = clientId =>
		CHAT_COLORS[clientId.charCodeAt(0) % (CHAT_COLORS.length)];

	const newCommentId = () => uuid.v1();

	const isBool = val => typeof val === 'boolean';

	const isAllBools = dict =>
		Object.values(dict).length === Object.values(dict).filter(isBool).length;

	const hasOnlyTheseKeys = (dict, keys) =>
		Object.keys(dict).filter(key => keys.includes(key)).length === Object.keys(dict).length;

	const hasAnyOfTheseKeys = (dict, keys) =>
		Object.keys(dict).filter(key => keys.includes(key)).length > 0;

	const isHexColor = color => hexColorRegex({ strict: true }).test(color);

	return {
		wrap,
		defaultFalse,
		newUnlistedBroadcastId,
		randomBroadcastName,
		isValidUnlistedBroadcastName,
		isPublicBroadcastId,
		isUnlistedBroadcastId,
		isValidBroadcastId,
		channelFromBroadcastId,
		clientIdContainsSession,
		newClientId,
		newF2fToken,
		isValidVideoRoomId,
		isValidChatText,
		isValidHexColor,
		isValidLayout,
		isValidBase64Img,
		clientChatColor,
		newCommentId,
		isAllBools,
		hasOnlyTheseKeys,
		hasAnyOfTheseKeys,
		isHexColor,
	};
};
