import { combineEpics } from 'redux-observable';

import { broadcastEpics } from 'services/broadcast';
import { chatEpics } from 'services/chat';
import { discoverEpics } from 'services/discover';
import { notificationEpics } from 'services/notification';
import { onboardEpics } from 'services/onboard';
import { pageEpics } from 'services/page';
import { payEpics } from 'services/pay';
import { publishEpics } from 'services/publish';
import { queueEpics } from 'services/queue';
import { restreamEpics } from 'services/restream';
import { settingsEpics } from 'services/settings';
import { userEpics } from 'services/user';
import { videoEpics } from 'services/video';

export default combineEpics(
	broadcastEpics,
	chatEpics,
	discoverEpics,
	notificationEpics,
	onboardEpics,
	pageEpics,
	payEpics,
	publishEpics,
	queueEpics,
	restreamEpics,
	settingsEpics,
	userEpics,
	videoEpics,
);
