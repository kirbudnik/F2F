module.exports = ({ _, config }) => {
	const { S3_BUCKET_PATH, MAX_DISCOVERABLES } = config;


	function addBucketPath(img) {
		if (typeof img === 'string') {
			return `${S3_BUCKET_PATH}/${img}`;
		}
		return img;
	}


	// Fisher-Yates shuffle
	function shuffleArray(array) {
		const arr = [...array];

		for (let i = arr.length - 1; i > 0; i -= 1) {
			let j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}


	const meetsDiscoverableRequirements = channel =>
		channel.coverSrc && channel.avatarSrc && channel.about;


	function chooseDiscoverables(users, broadcastIds) {
		const channels = _.flatten(users.map(user =>
			user.channels
				.filter(meetsDiscoverableRequirements)
				.map(channel => ({
					username: user.username,
					channelName: channel.name,
					avatarSrc: addBucketPath(channel.avatarSrc),
					coverSrc: addBucketPath(channel.coverSrc),
					isLive: broadcastIds.includes(`${user.lowercaseUsername}.${channel.lowercaseName}`),
				})),
		));

		// Shuffle the order of the results. Always show channels that are live
		return shuffleArray([
			...shuffleArray(channels.filter(c => c.isLive)),
			...shuffleArray(channels.filter(c => !c.isLive)),
		].slice(0, MAX_DISCOVERABLES));
	}

	return { chooseDiscoverables };
};
