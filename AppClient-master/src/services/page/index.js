import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';

import { BASE_API_PATH } from 'constants/index';
import request from 'services/request';
import { expBackoff } from 'services/utils';

import actions, { actionTypes } from './page.actions';
import Reducer, { Selectors } from './page.reducer';
import Requests from './page.requests';
import Epics from './page.epics';


const reducer = Reducer(actionTypes);
const selectors = Selectors(createSelector);
const requests = Requests(request, BASE_API_PATH);
const epics = Epics({
	Observable,
	combineEpics,
	requests,
	expBackoff,
	actions,
	actionTypes,
	selectors,
});

export {
	actions as pageActions,
	reducer as pageReducer,
	selectors as pageSelectors,
	epics as pageEpics,
};
