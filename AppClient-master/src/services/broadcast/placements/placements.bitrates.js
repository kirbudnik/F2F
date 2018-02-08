function lowest(val1, val2) {
	if (val1 < val2) {
		return val1;
	}
	return val2;
}

export default ({ videoLayouts, bitrateDefs, positionDefs }) => {
	const { HIDDEN_BY_CHOICE_POS, HIDDEN_BY_LAYOUT_POS, HOST_POS, SCREEN_POS } = positionDefs;
	const { ROOM_CAP, SCREEN_CAP, CAMERA_CAP, SCREEN_MUTED, CAMERA_MUTED } = bitrateDefs;
	const { GROUP, HOST, SOLO, NEWS, SCREEN, PRESENTATION } = videoLayouts;

	const isHidden = pos => pos === HIDDEN_BY_LAYOUT_POS || pos === HIDDEN_BY_CHOICE_POS;

	const handleRequest = handlers => (args) => {
		let br = null;

		if (!isHidden(args.pos) && args.layout in handlers) {
			br = handlers[args.layout](args);
		}
		if (br === null) {
			// We should still set a bitrate even when we are muted since we will
			// still be uploading at this rate, it just won't be forwarded.
			br = args.isScreen ? SCREEN_MUTED : CAMERA_MUTED;
		}

		return br;
	};

	return handleRequest({
		[SOLO]: ({ pos }) => {
			if (pos === HOST_POS) {
				return CAMERA_CAP;
			}
			return null;
		},

		[NEWS]: ({ pos, isHostPosFilled, isScreenPosFilled }) => {
			// News screen overlay
			if (pos === SCREEN_POS && isHostPosFilled) {
				return lowest(ROOM_CAP * 0.4, SCREEN_CAP);
			}
			// Full screen if no host camera
			if (pos === SCREEN_POS) {
				return SCREEN_CAP;
			}
			if (pos === HOST_POS && isScreenPosFilled) {
				return lowest(ROOM_CAP * 0.6, CAMERA_CAP);
			}
			if (pos === HOST_POS) {
				return CAMERA_CAP;
			}
			return null;
		},

		[HOST]: ({ pos, guestCameraCount }) => {
			if (pos === SCREEN_POS) {
				return null;
			}

			let guestBitrate;

			if (guestCameraCount <= 3) {
				guestBitrate = 256;
			} else if (guestCameraCount <= 4) {
				guestBitrate = 196;
			} else if (guestCameraCount <= 6) {
				guestBitrate = 128;
			} else {
				guestBitrate = 64;
			}
			// Fullscreen camera
			if (pos === HOST_POS) {
				return lowest(ROOM_CAP - (guestCameraCount * guestBitrate), CAMERA_CAP);
			}
			return guestBitrate;
		},

		[GROUP]: ({ pos, guestCameraCount }) => {
			if (pos === SCREEN_POS) {
				return null;
			}
			if (guestCameraCount === 0) {
				return CAMERA_CAP;
			}
			return lowest(ROOM_CAP / (guestCameraCount + 1), CAMERA_CAP);
		},

		[SCREEN]: ({ pos, guestCameraCount, isHostPosFilled }) => {
			const camCount = (guestCameraCount + (isHostPosFilled ? 1 : 0));
			let camBr;

			if (camCount <= 2) {
				camBr = 256;
			} else if (camCount <= 4) {
				camBr = 196;
			} else if (camCount <= 6) {
				camBr = 128;
			} else {
				camBr = 64;
			}

			if (pos === SCREEN_POS) {
				return lowest(ROOM_CAP - (camCount * camBr), SCREEN_CAP);
			}
			return camBr;
		},

		[PRESENTATION]: ({ pos }) => {
			if (pos === SCREEN_POS) {
				return SCREEN_CAP;
			}
			return null;
		},
	});
};
