import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import url from 'url';

import { BASE_API_PATH } from 'constants/index';
import { alerts } from 'constants/broadcast';
import ga from 'services/googleAnalytics';
import logger from 'services/logger';
import request from 'services/request';
import { popupWindow, expBackoff } from 'services/utils';
import { notificationActions } from 'services/notification';
import { broadcastActions, broadcastActionTypes, broadcastSelectors } from 'services/broadcast';
import { videoActions, videoActionTypes } from 'services/video';

import actions, { actionTypes } from './restream.actions';
import Reducer, { Selectors } from './restream.reducer';
import Requests from './restream.requests';
import Epics from './restream.epics';

const reducer = Reducer({ actionTypes, broadcastActionTypes, videoActionTypes });
const selectors = Selectors(createSelector);
const requests = Requests(request, BASE_API_PATH);


const epics = Epics({
	Observable,
	combineEpics,
	url,
	selectors,
	requests,
	BASE_API_PATH,
	actionTypes,
	actions,
	notificationActions,
	broadcastActions,
	broadcastActionTypes,
	broadcastSelectors,
	videoActions,
	alerts,
	popupWindow,
	expBackoff,
	ga,
	logger,
});

export {
	actions as restreamActions,
	epics as restreamEpics,
	reducer as restreamReducer,
	selectors as restreamSelectors,
};
