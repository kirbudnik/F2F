import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import url from 'url';

import { BASE_API_PATH } from 'constants/index';
import logger from 'services/logger';
import { popupWindow, expBackoff } from 'services/utils';
import ga from 'services/googleAnalytics';
import request from 'services/request';
import { notificationActions } from 'services/notification';
import { userActions, userSelectors } from 'services/user';

import actions, { actionTypes } from './settings.actions';
import Reducer, { Selectors } from './settings.reducer';
import Requests from './settings.requests';
import Epics from './settings.epics';

const reducer = Reducer(actionTypes);
const selectors = Selectors(createSelector);
const requests = Requests(request, BASE_API_PATH);

const epics = Epics({
	Observable,
	combineEpics,
	url,
	popupWindow,
	expBackoff,
	ga,
	logger,
	requests,
	notificationActions,
	userActions,
	userSelectors,
	actions,
	actionTypes,
	selectors,
});

export {
	epics as settingsEpics,
	reducer as settingsReducer,
	actions as settingsActions,
	selectors as settingsSelectors,
};
