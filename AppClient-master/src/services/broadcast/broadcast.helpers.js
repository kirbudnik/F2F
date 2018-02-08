export default (videoLayouts) => {
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

	const isUnlistedBroadcastId = id =>
		isValidBroadcastId(id) &&
		id.split('.')[1].charAt(0) === '-';

	const channelFromBroadcastId = id => id.split('.').pop();

	function nameFromBroadcastId(id) {
		if (isUnlistedBroadcastId(id)) {
			// Name does not include the '-'
			return channelFromBroadcastId(id).slice(1);
		}
		return channelFromBroadcastId(id);
	}

	const layoutHasScreen = layout =>
		layout === videoLayouts.NEWS ||
		layout === videoLayouts.SCREEN ||
		layout === videoLayouts.PRESENTATION;


	const layoutHasGuests = layout =>
		layout === videoLayouts.HOST ||
		layout === videoLayouts.GROUP ||
		layout === videoLayouts.SCREEN;

	return {
		isValidBroadcastId,
		isUnlistedBroadcastId,
		channelFromBroadcastId,
		nameFromBroadcastId,
		layoutHasScreen,
		layoutHasGuests,
	};
};
