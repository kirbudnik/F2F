import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import url from 'url';

import { BASE_API_PATH } from 'constants/index';
import * as constants from 'constants/user';
import ga from 'services/googleAnalytics';
import logger from 'services/logger';
import request from 'services/request';
import { popupWindow, expBackoff, cookies } from 'services/utils';
import { notificationActions } from 'services/notification';

import actions, { actionTypes } from './user.actions';
import Reducer, { Selectors } from './user.reducer';
import Requests from './user.requests';
import Epics from './user.epics';
import history from '../../history';

// FIXME - Circular dependency
import pageActions from '../page/page.actions';


const reducer = Reducer(actionTypes);
const selectors = Selectors(createSelector);
const requests = Requests(request, BASE_API_PATH);
const epics = combineEpics(...Object.values(Epics({
	Observable,
	url,
	ga,
	logger,
	constants,
	selectors,
	actionTypes,
	actions,
	pageActions,
	notificationActions,
	location,
	requests,
	history,
	popupWindow,
	expBackoff,
	cookies,
	window,
})));

export {
	actions as userActions,
	actionTypes as userActionTypes,
	reducer as userReducer,
	selectors as userSelectors,
	epics as userEpics,
};
