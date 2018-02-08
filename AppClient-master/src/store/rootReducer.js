import { combineReducers } from 'redux';

import { broadcastReducer } from 'services/broadcast';
import { chatReducer } from 'services/chat';
import { discoverReducer } from 'services/discover';
import { notificationReducer } from 'services/notification';
import { onboardReducer } from 'services/onboard';
import { pageReducer } from 'services/page';
import { payReducer } from 'services/pay';
import { publishReducer } from 'services/publish';
import { queueReducer } from 'services/queue';
import { restreamReducer } from 'services/restream';
import { settingsReducer } from 'services/settings';
import { userReducer } from 'services/user';

export default combineReducers({
	broadcast: broadcastReducer,
	chat: chatReducer,
	discover: discoverReducer,
	notification: notificationReducer,
	onboard: onboardReducer,
	page: pageReducer,
	pay: payReducer,
	publish: publishReducer,
	queue: queueReducer,
	restream: restreamReducer,
	settings: settingsReducer,
	user: userReducer,
});
