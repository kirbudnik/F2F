/* global chrome */
import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';

import history from 'history';
import { BASE_API_PATH, DEBUG } from 'constants/index';
import {
	userTypes,
	appMessageTypes,
	videoLayouts,
	videoRoles,
	alerts,
} from 'constants/broadcast';
import ga from 'services/googleAnalytics';
import logger from 'services/logger';
import { expBackoff } from 'services/utils';
import request from 'services/request';
import { notificationActions } from 'services/notification';
import { pageActions } from 'services/page';
import { userActionTypes, userSelectors } from 'services/user';
import { videoActions, videoActionTypes } from 'services/video';

import Placements from './placements';
import Helpers from './broadcast.helpers';
import actions, { actionTypes } from './broadcast.actions';
import Reducer, { Selectors } from './broadcast.reducer';
import Requests from './broadcast.requests';
import Epics from './broadcast.epics';


const addPlacements = Placements({ videoLayouts, videoRoles });
const helpers = Helpers(videoLayouts);

const reducer = Reducer({
	actionTypes,
	userActionTypes,
	videoActionTypes,
	userTypes,
	addPlacements,
});

const selectors = Selectors(createSelector, userTypes);
const requests = Requests(request, BASE_API_PATH);

const epics = combineEpics(...Object.values(Epics({
	Observable,
	actions,
	actionTypes,
	selectors,
	notificationActions,
	pageActions,
	userActionTypes,
	userSelectors,
	videoActions,
	videoActionTypes,
	videoLayouts,
	videoRoles,
	appMessageTypes,
	helpers,
	requests,
	alerts,
	history,
	ga,
	logger,
	expBackoff,
	DEBUG,
	chrome: typeof chrome !== 'undefined' ? chrome : undefined,
})));

export {
	epics as broadcastEpics,
	reducer as broadcastReducer,
	actions as broadcastActions,
	actionTypes as broadcastActionTypes,
	selectors as broadcastSelectors,
};
