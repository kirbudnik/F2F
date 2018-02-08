import Positions from './placements.positions';
import Coords from './placements.coords';
import Bitrates from './placements.bitrates';

const positionDefs = {
	HIDDEN_BY_CHOICE_POS: -2,
	HIDDEN_BY_LAYOUT_POS: -1,
	SCREEN_POS: 0,
	HOST_POS: 1,
};

// We should still set a bitrate even when muted since we may still be uploading,
// they just won't be getting forwarded. This needs to balance the fact that we don't
// want to upload too much unnecessary data with the fact that we don't want to drop it
// too low since it will take awhile to bring back up when re-enabled.
const bitrateDefs = {
	ROOM_CAP: 1200,
	SCREEN_CAP: 1200,
	CAMERA_CAP: 800,
	SCREEN_MUTED: 300,
	CAMERA_MUTED: 300,
};

export default ({ videoLayouts, videoRoles }) => {
	const hiddenHostLayouts = [videoLayouts.PRESENTATION];
	const hiddenScreenLayouts = [videoLayouts.SOLO, videoLayouts.GROUP, videoLayouts.HOST];

	const getPositions = Positions({ videoRoles, positionDefs });
	const getCoords = Coords({ videoLayouts, positionDefs });
	const getBitrate = Bitrates({ videoLayouts, bitrateDefs, positionDefs });

	// May be hidden by layout even if pos != hidden by layout pos
	// FIXME - This is a temp hack... We will want to refactor the logic here
	const isHiddenByLayout = (coords, position, isScreen, layout) => coords.z === 0 && (
		position === positionDefs.HIDDEN_BY_LAYOUT_POS ||
		(!isScreen && hiddenHostLayouts.includes(layout)) ||
		(isScreen && hiddenScreenLayouts.includes(layout))
	);

	return (streams, layout) => {
		const {
			positions,
			guestCameraCount,
			hostStreamId,
			screenStreamId,
		} = getPositions(streams);

		const withPlacements = {};
		const isHostPosFilled = hostStreamId !== null;
		const isScreenPosFilled = screenStreamId !== null;
		const isLayoutFlipped = hostStreamId !== null && streams[hostStreamId].isPub;

		Object.keys(streams).forEach((id) => {
			const stream = streams[id];
			const pos = positions[id];

			const coords = getCoords({
				pos,
				layout,
				guestCameraCount,
				isHostPosFilled,
				isScreenPosFilled,
				isLayoutFlipped,
			});

			withPlacements[id] = {
				...stream,
				coords,
				restreamCoords: isLayoutFlipped ?
					getCoords({
						pos,
						layout,
						guestCameraCount,
						isHostPosFilled,
						isScreenPosFilled,
						isLayoutFlipped: false,
					}) :
					coords,
				bitrate: getBitrate({
					pos,
					layout,
					guestCameraCount,
					isHostPosFilled,
					isScreenPosFilled,
					isScreen: stream.isScreen,
				}),
				isHiddenByLayout: isHiddenByLayout(
					coords,
					positions[id],
					stream.isScreen,
					layout,
				),
			};
		});

		return withPlacements;
	};
};
