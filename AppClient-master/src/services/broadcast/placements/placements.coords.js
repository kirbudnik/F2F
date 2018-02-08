// Is key in the range [low, high]
const inRange = (val, low, high) =>
	val === low || val === high || (val > low && val < high);

function lowest(val1, val2) {
	if (val1 < val2) {
		return val1;
	}
	return val2;
}

const hidden = () => ({ w: 0, h: 0, x: 0, y: 0, z: 0 });
const fullScreen = () => ({ w: 100, h: 100, x: 0, y: 0, z: 1 });

const rotate = cw => ({
	transform: `perspective(1000px) rotateY(${cw ? '-' : ''}20deg)`,
	transformOrigin: '50% 50%',
});

// const rotateCw = rotate(true);
const rotateCcw = rotate(false);

let w;
let h;
let x;
let y;
let margin;

export default ({ videoLayouts, positionDefs }) => {
	const { HIDDEN_BY_CHOICE_POS, HIDDEN_BY_LAYOUT_POS, HOST_POS, SCREEN_POS } = positionDefs;
	const { GROUP, HOST, SOLO, NEWS, SCREEN, PRESENTATION } = videoLayouts;

	const isHidden = pos => pos === HIDDEN_BY_LAYOUT_POS || pos === HIDDEN_BY_CHOICE_POS;

	const handleRequest = handlers => (args) => {
		if (isHidden(args.pos)) {
			return hidden();
		}
		if (args.layout in handlers) {
			return handlers[args.layout](args);
		}
		return hidden();
	};

	return handleRequest({
		[SOLO]: ({ pos }) => {
			if (pos === HOST_POS) {
				return fullScreen();
			}
			return hidden();
		},

		[NEWS]: ({ pos, isHostPosFilled, isScreenPosFilled, isLayoutFlipped }) => {
			margin = 1;

			// News screen overlay
			if (pos === SCREEN_POS && isHostPosFilled) {
				w = 45;
				h = 45;
				y = 33 - (h / 2);
				x = isLayoutFlipped ? (100 - w - margin) : margin;

				return { w, h, y, x, z: 2 };
			}
			// Full screen if no host camera
			if (pos === SCREEN_POS) {
				return fullScreen();
			}
			if (pos === HOST_POS && isScreenPosFilled) {
				return { w: 100, h: 100, y: 0, x: isLayoutFlipped ? -18 : 18, z: 1 };
			}
			if (pos === HOST_POS) {
				return fullScreen();
			}
			return hidden();
		},

		[HOST]: ({ pos, guestCameraCount, isLayoutFlipped }) => {
			margin = 1.5;

			if (pos === SCREEN_POS) {
				return hidden();
			}
			if (pos === HOST_POS) {
				x = 7 * (Math.floor((guestCameraCount - 1) / 3) + 1);
				return { w: 100, h: 100, y: 0, x: isLayoutFlipped ? -(x) : x, z: 1 };
			}
			// Guests
			if (guestCameraCount === 1) {
				h = 33;
				w = h / (4 / 3);
				y = 35 - (h / 2); // Center vid on upper third
				x = isLayoutFlipped ? (100 - w - margin) : margin;
				return { w, h, y, x, z: 2 };
			}
			if (guestCameraCount === 2) {
				// Space between videos and y margin and videos and bottom margin
				const vertMargin = 15;
				// Space between videos
				const vertGap = 7;

				h = (100 - (2 * vertMargin) - vertGap) / 2;
				w = h / (4 / 3);
				y = ((pos - HOST_POS - 1) * (h + vertGap)) + vertMargin;
				x = isLayoutFlipped ? (100 - w - margin) : margin;
				return { w, h, y, x, z: 2 };
			}
			// Many guests
			let aspect = null;

			if (guestCameraCount <= 3) {
				aspect = (4 / 3);
			} else if (guestCameraCount <= 6) {
				aspect = 1;
			} else {
				aspect = (8 / 9);
			}
			h = (100 - (4 * margin)) / 3;
			w = (h * aspect) / (16 / 9);
			// Every 2nd column flipped
			const col = Math.floor((pos - HOST_POS - 1) / 3);
			const row = col % 2 === 0 ?
				(pos - HOST_POS - 1) % 3 :
				2 - ((pos - HOST_POS - 1) % 3);

			y = (row * (h + margin)) + margin;
			x = isLayoutFlipped ?
				(100 - ((col + 1) * (w + margin))) :
				(col * (w + margin)) + margin;

			return { w, h, y, x, z: 2 };
		},

		[GROUP]: ({ pos, guestCameraCount }) => {
			margin = 1;

			if (pos === SCREEN_POS) {
				return hidden();
			}
			if (guestCameraCount === 0) {
				return fullScreen();
			}
			if (guestCameraCount === 1) {
				// Two screens half width
				margin = 0;
				w = (100 - margin) / 2;
				x = (pos - HOST_POS) * (w + margin);
				return { w, h: 100, y: 0, x, z: 1 };
			}
			if (guestCameraCount === 2) {
				// Three screens 1/3 width
				margin = 0;
				w = (100 - (2 * margin)) / 3;
				x = (pos - HOST_POS) * (w + margin);
				return { w, h: 100, y: 0, x, z: 1 };
			}
			if (guestCameraCount === 3) {
				// Four corners
				w = (100 - margin) / 2;
				h = w;
				const row = Math.floor((pos - HOST_POS) / 2);

				y = row * (margin + h);
				if (row === 0) {
					x = ((pos - HOST_POS) % 2) * (w + margin);
				} else {
					x = (1 - ((pos - HOST_POS) % 2)) * (w + margin);
				}
				return { w, h, y, x, z: 1 };
			}
			if (inRange(guestCameraCount, 4, 5)) {
				// Five or six 4:3 videos
				margin = 0.8;
				w = (100 - (2 * margin)) / 3;
				h = (4 / 3) * w;
				// Vertical spacing between rows. Larger than regular margin
				const vertMargin = (100 - (2 * h)) / 3;
				const row = Math.floor((pos - HOST_POS) / 3);

				y = (row * h) + ((row + 1) * vertMargin);
				if (row === 0) {
					x = (pos - HOST_POS) * (w + margin);
				} else if (guestCameraCount === 4) {				// Center bottom row videos
					const horizMargin = (100 - (2 * w) - margin) / 2;
					x = ((1 - ((pos - HOST_POS) % 3)) * (w + margin)) + horizMargin;
				} else {
					x = (2 - ((pos - HOST_POS) % 3)) * (w + margin);
				}
				return { w, h, y, x, z: 1 };
			}
			// Seven to nine 16:9 videos
			w = (100 - (2 * margin)) / 3;
			h = w;
			const row = Math.floor((pos - HOST_POS) / 3);

			y = row * (margin + h);
			if (row === 0) {
				x = (pos - HOST_POS) * (w + margin);
			} else if (row === 1) {
				x = (2 - ((pos - HOST_POS) % 3)) * (w + margin);
			} else if (guestCameraCount === 6) {
				// Center single bottom element
				x = (100 - w) / 2;
			} else if (guestCameraCount === 7) {
				// center the two bottom elements with equal spacing between each other and sides
				const horizMargin = (100 - (2 * w) - margin) / 2;

				x = (((pos - HOST_POS) % 3) * (w + margin)) + horizMargin;
			} else {
				x = ((pos - HOST_POS) % 3) * (w + margin);
			}
			return { w, h, y, x, z: 1 };
		},

		[SCREEN]: ({ pos, guestCameraCount, isHostPosFilled }) => {
			margin = 1;
			const maxCamW = 20;
			const camCount = guestCameraCount + (isHostPosFilled ? 1 : 0);

			if (pos === SCREEN_POS && camCount === 0) {
				return fullScreen();
			}
			if (pos === SCREEN_POS) {
				const clearance = maxCamW + margin;

				return {
					...rotateCcw,
					w: 100 - clearance,
					h: 100 - clearance,
					x: 0,
					y: clearance / 2,
					z: 1,
				};
			}

			h = lowest(maxCamW * (4 / 3), (100 - ((camCount + 1) * margin)) / camCount);
			w = lowest(maxCamW, h / (4 / 3));
			x = 100 - w - margin;

			if (camCount === 1) {
				y = 50 - (h / 2);
			} else if (camCount === 2) {
				y = (((pos - HOST_POS) + 1) * 33) - (h / 2);
			} else {
				const gap = (100 - ((camCount * (h + margin)) + margin)) / 2;
				y = (gap + margin) + ((pos - HOST_POS) * (h + margin));
			}

			return { w, h, y, x, z: 2 };
		},

		[PRESENTATION]: ({ pos }) => {
			if (pos === SCREEN_POS) {
				return fullScreen();
			}
			return hidden();
		},
	});
};
