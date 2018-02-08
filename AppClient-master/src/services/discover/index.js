import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';

import { BASE_API_PATH } from 'constants/index';
import request from 'services/request';
import logger from 'services/logger';
import ga from 'services/googleAnalytics';
import { expBackoff } from 'services/utils';
import { broadcastActionTypes } from 'services/broadcast';

import actions, { actionTypes } from './discover.actions';
import Reducer, { Selectors } from './discover.reducer';
import Requests from './discover.requests';
import Epics from './discover.epics';


const reducer = Reducer(actionTypes);
const selectors = Selectors(createSelector);
const requests = Requests(request, BASE_API_PATH);
const epics = combineEpics(...Object.values(Epics({
	Observable,
	requests,
	logger,
	ga,
	expBackoff,
	actions,
	actionTypes,
	selectors,
	broadcastActionTypes,
})));

export {
	actions as discoverActions,
	reducer as discoverReducer,
	selectors as discoverSelectors,
	epics as discoverEpics,
};
