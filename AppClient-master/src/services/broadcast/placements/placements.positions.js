export default ({ videoRoles, positionDefs }) => {
	const { HIDDEN_BY_CHOICE_POS, HIDDEN_BY_LAYOUT_POS, SCREEN_POS, HOST_POS } = positionDefs;

	const isModerator = role => role === videoRoles.MODERATOR;

	return (streams) => {
		const positions = {};
		let guestCameraCount = 0;
		let screenStreamId = null;
		let hostStreamId = null;

		// Sort by start time
		const sorted = Object.keys(streams).map(id => streams[id]).sort((a, b) => {
			if (a.startedAt < b.startedAt) {
				return -1;
			}
			return 1;
		});

		// Screens
		sorted
			.filter(stream => stream.isScreen)
			.forEach((stream) => {
				if (!stream.hasVideo) {
					positions[stream.id] = HIDDEN_BY_CHOICE_POS;
				} else if (screenStreamId === null) {
					positions[stream.id] = SCREEN_POS;
					screenStreamId = stream.id;
				} else {
					positions[stream.id] = HIDDEN_BY_LAYOUT_POS;
				}
			});

		// Moderators
		sorted
			.filter(stream => (isModerator(stream.role) && !stream.isScreen))
			.forEach((stream) => {
				if (!stream.hasVideo) {
					positions[stream.id] = HIDDEN_BY_CHOICE_POS;
				} else if (hostStreamId === null) {
					positions[stream.id] = HOST_POS;
					hostStreamId = stream.id;
				} else {
					guestCameraCount += 1;
					positions[stream.id] = HOST_POS + guestCameraCount;
				}
			});

		// Guests
		sorted
			.filter(stream => (!isModerator(stream.role) && !stream.isScreen))
			.forEach((stream) => {
				// Guest can fill host spot if not already taken
				if (hostStreamId === null) {
					positions[stream.id] = HOST_POS;
					hostStreamId = stream.id;
				} else {
					guestCameraCount += 1;
					positions[stream.id] = HOST_POS + guestCameraCount;
				}
			});

		return {
			positions,
			guestCameraCount,
			hostStreamId,
			screenStreamId,
		};
	};
};
