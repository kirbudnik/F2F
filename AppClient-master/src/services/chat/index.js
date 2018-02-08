import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import localStorage from 'localStorage';

import { BASE_API_PATH } from 'constants/index';
import { alerts, appMessageTypes } from 'constants/broadcast';
import { MAX_COMMENT_LEN, MAX_COMMENTS_SAVED, CHAT_COLOR } from 'constants/chat';
import ga from 'services/googleAnalytics';
import logger from 'services/logger';
import { expBackoff } from 'services/utils';
import request from 'services/request';
import { broadcastActions, broadcastActionTypes, broadcastSelectors } from 'services/broadcast';
import { userActions, userActionTypes, userSelectors } from 'services/user';
import { videoActionTypes } from 'services/video';
import actions, { actionTypes } from './chat.actions';
import Reducer, { Selectors } from './chat.reducer';
import Requests from './chat.requests';
import Epics from './chat.epics';


const reducer = Reducer({
	actionTypes,
	broadcastActionTypes,
	MAX_COMMENTS_SAVED,
	MAX_COMMENT_LEN,
});
const selectors = Selectors();
const requests = Requests(request, BASE_API_PATH);
const epics = Epics({
	Observable,
	combineEpics,
	localStorage,
	ga,
	logger,
	alerts,
	appMessageTypes,
	MAX_COMMENT_LEN,
	CHAT_COLOR,
	requests,
	expBackoff,
	actions,
	actionTypes,
	selectors,
	userActions,
	userActionTypes,
	userSelectors,
	broadcastActions,
	broadcastActionTypes,
	broadcastSelectors,
	videoActionTypes,
});


const exposedActions = {
	inputChange: actions.inputChange,
	markAsRead: actions.markAsRead,
	submitAttempt: actions.submitAttempt,
};

export {
	epics as chatEpics,
	reducer as chatReducer,
	exposedActions as chatActions,
	selectors as chatSelectors,
};
