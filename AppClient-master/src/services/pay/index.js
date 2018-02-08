import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';

import { BASE_API_PATH } from 'constants/index';
import ga from 'services/googleAnalytics';
import request from 'services/request';
import { expBackoff } from 'services/utils';
import { notificationActions } from 'services/notification';

import actions, { actionTypes } from './pay.actions';
import Reducer, { Selectors } from './pay.reducer';
import Requests from './pay.requests';
import Epics from './pay.epics';

const reducer = Reducer(actionTypes);
const selectors = Selectors(createSelector);
const requests = Requests(request, BASE_API_PATH);

const epics = combineEpics(...Object.values(Epics({
	Observable,
	ga,
	requests,
	expBackoff,
	actions,
	actionTypes,
	selectors,
	notificationActions,
})));

export {
	actions as payActions,
	epics as payEpics,
	reducer as payReducer,
	selectors as paySelectors,
};
