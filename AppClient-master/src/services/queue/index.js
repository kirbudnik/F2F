import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import localStorage from 'localStorage';

import ga from 'services/googleAnalytics';
import logger from 'services/logger';
import { BASE_API_PATH } from 'constants/index';
import { alerts, userTypes } from 'constants/broadcast';
import request from 'services/request';
import { expBackoff } from 'services/utils';
import { broadcastActions, broadcastActionTypes, broadcastSelectors } from 'services/broadcast';
import { publishActions, publishSelectors } from 'services/publish';
import { userActions, userActionTypes, userSelectors } from 'services/user';
import { videoActions, videoActionTypes } from 'services/video';

import actions, { actionTypes } from './queue.actions';
import Reducer, { Selectors } from './queue.reducer';
import Requests from './queue.requests';
import Epics from './queue.epics';

const reducer = Reducer({ actionTypes, broadcastActionTypes });
const selectors = Selectors(createSelector);
const requests = Requests(request, BASE_API_PATH);

const epics = Epics({
	Observable,
	combineEpics,
	localStorage,
	ga,
	logger,
	requests,
	expBackoff,
	alerts,
	userTypes,
	actions,
	actionTypes,
	selectors,
	userActions,
	userActionTypes,
	userSelectors,
	broadcastActions,
	broadcastActionTypes,
	broadcastSelectors,
	publishActions,
	publishSelectors,
	videoActions,
	videoActionTypes,
});

export {
	epics as queueEpics,
	reducer as queueReducer,
	actions as queueActions,
	selectors as queueSelectors,
};
