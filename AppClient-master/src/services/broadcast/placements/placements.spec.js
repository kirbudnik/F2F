import { test } from 'tape';

import Positions from './placements.positions';
import Coords from './placements.coords';
import Bitrates from './placements.bitrates';

const videoRoles = {
	MODERATOR: 'moderator',
	STUDENT: 'student',
};

const videoLayouts = {
	SOLO: 'solo',
	NEWS: 'news',
	HOST: 'host',
	GROUP: 'group',
	SCREEN: 'screen',
	PRESENTATION: 'presentation',
};

const bitrateDefs = {
	ROOM_CAP: 1800,
	SCREEN_CAP: 1800,
	CAMERA_CAP: 900,
	SCREEN_MUTED: 1000,
	CAMERA_MUTED: 500,
};

const HIDDEN_BY_CHOICE_POS = -2;
const HIDDEN_BY_LAYOUT_POS = -1;
const SCREEN_POS = 0;
const HOST_POS = 1;

const positionDefs = {
	HIDDEN_BY_CHOICE_POS,
	HIDDEN_BY_LAYOUT_POS,
	SCREEN_POS,
	HOST_POS,
};

const getPositions = Positions({ videoRoles, positionDefs });
const getCoords = Coords({ videoLayouts, positionDefs });
const getBitrate = Bitrates({ videoLayouts, bitrateDefs, positionDefs });


test('Video placements', (a) => {
	// Positions
	a.test('positions', (b) => {
		b.test('ordered by start time', (t) => {
			const { positions } = getPositions({
				guest1: {
					id: 'guest1',
					role: videoRoles.STUDENT,
					isScreen: false,
					hasVideo: true,
					startedAt: 1,
				},
				guest2: {
					id: 'guest2',
					role: videoRoles.STUDENT,
					isScreen: false,
					hasVideo: true,
					startedAt: 2,
				},
				guest3: {
					id: 'guest3',
					role: videoRoles.STUDENT,
					isScreen: false,
					hasVideo: true,
					startedAt: 3,
				},
			});

			t.equal(positions.guest1, HOST_POS);
			t.equal(positions.guest2, HOST_POS + 1);
			t.equal(positions.guest3, HOST_POS + 2);
			t.end();
		});

		b.test('returns correct host stream id', (t) => {
			const { hostStreamId } = getPositions({
				guest1: {
					id: 'guest1',
					role: videoRoles.STUDENT,
					isScreen: false,
					hasVideo: true,
					startedAt: 1,
				},
				guest2: {
					id: 'guest2',
					role: videoRoles.STUDENT,
					isScreen: false,
					hasVideo: true,
					startedAt: 2,
				},
				host1: {
					id: 'host1',
					role: videoRoles.MODERATOR,
					isScreen: false,
					hasVideo: true,
					startedAt: 3,
				},
			});

			t.equal(hostStreamId, 'host1');
			t.end();
		});

		b.test('returns correct screen stream id', (t) => {
			const { screenStreamId } = getPositions({
				guest1: {
					id: 'guest1',
					role: videoRoles.STUDENT,
					isScreen: false,
					hasVideo: true,
				},
				host1: {
					id: 'host1',
					role: videoRoles.MODERATOR,
					isScreen: false,
					hasVideo: true,
				},
				screen1: {
					id: 'screen1',
					role: videoRoles.MODERATOR,
					isScreen: true,
					hasVideo: true,
				},
			});

			t.equal(screenStreamId, 'screen1');
			t.end();
		});

		b.test('host is always positioned before guests', (t) => {
			const { positions } = getPositions({
				guest1: {
					id: 'guest1',
					role: videoRoles.STUDENT,
					isScreen: false,
					hasVideo: true,
					startedAt: 1,
				},
				guest2: {
					id: 'guest2',
					role: videoRoles.STUDENT,
					isScreen: false,
					hasVideo: true,
					startedAt: 2,
				},
				host1: {
					id: 'host1',
					role: videoRoles.MODERATOR,
					isScreen: false,
					hasVideo: true,
					startedAt: 3,
				},
			});

			t.equal(positions.host1, positionDefs.HOST_POS);
			t.end();
		});

		b.test('host without video is hidden', (t) => {
			const { positions } = getPositions({
				host: {
					id: 'host',
					role: videoRoles.MODERATOR,
					isScreen: false,
					hasVideo: false,
				},
			});

			t.equal(positions.host, HIDDEN_BY_CHOICE_POS);
			t.end();
		});

		b.test('second host becomes first guest', (t) => {
			const { positions } = getPositions({
				guest1: {
					id: 'guest1',
					role: videoRoles.STUDENT,
					isScreen: false,
					hasVideo: true,
					startedAt: 1,
				},
				host1: {
					id: 'host1',
					role: videoRoles.MODERATOR,
					isScreen: false,
					hasVideo: true,
					startedAt: 1,
				},
				host2: {
					id: 'host2',
					role: videoRoles.MODERATOR,
					isScreen: false,
					hasVideo: true,
					startedAt: 2,
				},
			});

			t.equal(positions.host2, HOST_POS + 1);
			t.end();
		});

		b.test('screen without video is hidden', (t) => {
			const { positions } = getPositions({
				screen: {
					id: 'screen',
					isScreen: true,
					hasVideo: false,
				},
			});

			t.equal(positions.screen, HIDDEN_BY_CHOICE_POS);
			t.end();
		});

		b.test('screen claims screen position', (t) => {
			const { positions } = getPositions({
				screen: {
					id: 'screen',
					isScreen: true,
					hasVideo: true,
				},
			});

			t.equal(positions.screen, SCREEN_POS);
			t.end();
		});

		b.test('second screen is hidden by layout', (t) => {
			const { positions } = getPositions({
				screen1: {
					id: 'screen1',
					isScreen: true,
					hasVideo: true,
					startedAt: 1,
				},
				screen2: {
					id: 'screen2',
					isScreen: true,
					hasVideo: true,
					startedAt: 2,
				},
			});

			t.equal(positions.screen2, HIDDEN_BY_LAYOUT_POS);
			t.end();
		});

		b.test('guest camera count includes excess hosts', (t) => {
			const { guestCameraCount } = getPositions({
				guest1: {
					id: 'guest1',
					role: videoRoles.STUDENT,
					isScreen: false,
					hasVideo: true,
					startedAt: 1,
				},
				host1: {
					id: 'host1',
					role: videoRoles.MODERATOR,
					isScreen: false,
					hasVideo: true,
					startedAt: 1,
				},
				host2: {
					id: 'host2',
					role: videoRoles.MODERATOR,
					isScreen: false,
					hasVideo: true,
					startedAt: 2,
				},
			});

			t.equal(guestCameraCount, 2);
			t.end();
		});
	});


	// Coords
	a.test('coords', (b) => {
		b.test('hidden positions are not displayed', (t) => {
			t.notOk(getCoords({
				pos: HIDDEN_BY_CHOICE_POS,
			}).z);
			t.notOk(getCoords({
				pos: HIDDEN_BY_LAYOUT_POS,
			}).z);
			t.end();
		});

		b.test('solo layout', (c) => {
			c.test('host displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.SOLO,
					pos: HOST_POS,
				}).z);
				t.end();
			});

			c.test('guests hidden', (t) => {
				t.notOk(getCoords({
					layout: videoLayouts.SOLO,
					pos: HOST_POS + 1,
				}).z);
				t.end();
			});

			c.test('screen hidden', (t) => {
				t.notOk(getCoords({
					layout: videoLayouts.SOLO,
					pos: SCREEN_POS,
				}).z);
				t.end();
			});
		});

		b.test('news layout', (c) => {
			c.test('host displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.NEWS,
					pos: HOST_POS,
				}).z);
				t.end();
			});

			c.test('guests hidden', (t) => {
				t.notOk(getCoords({
					layout: videoLayouts.NEWS,
					pos: HOST_POS + 1,
				}).z);
				t.end();
			});

			c.test('screen displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.NEWS,
					pos: SCREEN_POS,
				}).z);
				t.end();
			});
		});

		b.test('host layout', (c) => {
			c.test('host displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.HOST,
					pos: HOST_POS,
				}).z);
				t.end();
			});

			c.test('guests displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.HOST,
					pos: HOST_POS + 1,
				}).z);
				t.end();
			});

			c.test('screen hidden', (t) => {
				t.notOk(getCoords({
					layout: videoLayouts.HOST,
					pos: SCREEN_POS,
				}).z);
				t.end();
			});
		});

		b.test('group layout', (c) => {
			c.test('host displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.GROUP,
					pos: HOST_POS,
				}).z);
				t.end();
			});

			c.test('guests displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.GROUP,
					pos: HOST_POS + 1,
				}).z);
				t.end();
			});

			c.test('screen hidden', (t) => {
				t.notOk(getCoords({
					layout: videoLayouts.GROUP,
					pos: SCREEN_POS,
				}).z);
				t.end();
			});
		});

		b.test('screen layout', (c) => {
			c.test('host displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.SCREEN,
					pos: HOST_POS,
				}).z);
				t.end();
			});

			c.test('guests displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.SCREEN,
					pos: HOST_POS + 1,
				}).z);
				t.end();
			});

			c.test('screen displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.SCREEN,
					pos: SCREEN_POS,
				}).z);
				t.end();
			});
		});

		b.test('presentation layout', (c) => {
			c.test('host hidden', (t) => {
				t.notOk(getCoords({
					layout: videoLayouts.PRESENTATION,
					pos: HOST_POS,
				}).z);
				t.end();
			});

			c.test('guests hidden', (t) => {
				t.notOk(getCoords({
					layout: videoLayouts.PRESENTATION,
					pos: HOST_POS + 1,
				}).z);
				t.end();
			});

			c.test('screen displayed', (t) => {
				t.ok(getCoords({
					layout: videoLayouts.PRESENTATION,
					pos: SCREEN_POS,
				}).z);
				t.end();
			});
		});
	});


	// Bitrates
	a.test('bitrates', (b) => {
		b.test('hidden positions have muted bitrate', (t) => {
			t.equal(getBitrate({
				pos: HIDDEN_BY_CHOICE_POS,
				isScreen: false,
			}), bitrateDefs.CAMERA_MUTED);

			t.equal(getBitrate({
				pos: HIDDEN_BY_LAYOUT_POS,
				isScreen: false,
			}), bitrateDefs.CAMERA_MUTED);

			t.equal(getBitrate({
				pos: HIDDEN_BY_CHOICE_POS,
				isScreen: true,
			}), bitrateDefs.SCREEN_MUTED);

			t.equal(getBitrate({
				pos: HIDDEN_BY_LAYOUT_POS,
				isScreen: true,
			}), bitrateDefs.SCREEN_MUTED);
			t.end();
		});

		b.test('solo layout', (c) => {
			c.test('host has max bitrate', (t) => {
				t.equal(getBitrate({
					layout: videoLayouts.SOLO,
					pos: HOST_POS,
					isScreen: false,
				}), bitrateDefs.CAMERA_CAP);
				t.end();
			});

			c.test('guests bitrate is muted', (t) => {
				t.equal(getBitrate({
					layout: videoLayouts.SOLO,
					pos: HOST_POS + 1,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('screen bitrate is muted', (t) => {
				t.equal(getBitrate({
					layout: videoLayouts.SOLO,
					pos: SCREEN_POS,
					isScreen: true,
				}), bitrateDefs.SCREEN_MUTED);
				t.end();
			});
		});

		b.test('news layout', (c) => {
			c.test('host has bitrate', (t) => {
				t.notEqual(getBitrate({
					layout: videoLayouts.NEWS,
					pos: HOST_POS,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('guests bitrate is muted', (t) => {
				t.equal(getBitrate({
					layout: videoLayouts.NEWS,
					pos: HOST_POS + 1,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('screen has bitrate', (t) => {
				t.notEqual(getBitrate({
					layout: videoLayouts.NEWS,
					pos: SCREEN_POS,
					isScreen: true,
				}), bitrateDefs.SCREEN_MUTED);
				t.end();
			});
		});

		b.test('host layout', (c) => {
			c.test('host has bitrate', (t) => {
				t.notEqual(getBitrate({
					layout: videoLayouts.HOST,
					pos: HOST_POS,
					guestCameraCount: 1,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('guests have bitrate', (t) => {
				t.notEqual(getBitrate({
					layout: videoLayouts.HOST,
					pos: HOST_POS + 1,
					guestCameraCount: 1,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('screen bitrate is muted', (t) => {
				t.equal(getBitrate({
					layout: videoLayouts.HOST,
					pos: SCREEN_POS,
					guestCameraCount: 1,
					isScreen: true,
				}), bitrateDefs.SCREEN_MUTED);
				t.end();
			});
		});

		b.test('group layout', (c) => {
			c.test('host has bitrate', (t) => {
				t.notEqual(getBitrate({
					layout: videoLayouts.GROUP,
					pos: HOST_POS,
					guestCameraCount: 1,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('guests have bitrate', (t) => {
				t.notEqual(getBitrate({
					layout: videoLayouts.GROUP,
					pos: HOST_POS + 1,
					guestCameraCount: 1,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('screen bitrate is muted', (t) => {
				t.equal(getBitrate({
					layout: videoLayouts.GROUP,
					pos: SCREEN_POS,
					guestCameraCount: 1,
					isScreen: true,
				}), bitrateDefs.SCREEN_MUTED);
				t.end();
			});
		});

		b.test('screen layout', (c) => {
			c.test('host has bitrate', (t) => {
				t.notEqual(getBitrate({
					layout: videoLayouts.SCREEN,
					pos: HOST_POS,
					guestCameraCount: 1,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('guests have bitrate', (t) => {
				t.notEqual(getBitrate({
					layout: videoLayouts.SCREEN,
					pos: HOST_POS + 1,
					guestCameraCount: 1,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('screen has bitrate', (t) => {
				t.notEqual(getBitrate({
					layout: videoLayouts.SCREEN,
					pos: SCREEN_POS,
					guestCameraCount: 1,
					isScreen: true,
				}), bitrateDefs.SCREEN_MUTED);
				t.end();
			});
		});

		b.test('presentation layout', (c) => {
			c.test('host bitrate is muted', (t) => {
				t.equal(getBitrate({
					layout: videoLayouts.PRESENTATION,
					pos: HOST_POS,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('guests bitrate is muted', (t) => {
				t.equal(getBitrate({
					layout: videoLayouts.PRESENTATION,
					pos: HOST_POS + 1,
					isScreen: false,
				}), bitrateDefs.CAMERA_MUTED);
				t.end();
			});

			c.test('screen has bitrate', (t) => {
				t.equal(getBitrate({
					layout: videoLayouts.PRESENTATION,
					pos: SCREEN_POS,
					isScreen: true,
				}), bitrateDefs.SCREEN_CAP);
				t.end();
			});
		});
	});
});
