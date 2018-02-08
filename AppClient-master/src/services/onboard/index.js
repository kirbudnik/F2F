import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import localStorage from 'localStorage';

import { BASE_API_PATH } from 'constants/index';
import ga from 'services/googleAnalytics';
import logger from 'services/logger';
import { expBackoff } from 'services/utils';
import request from 'services/request';
import { userActions, userActionTypes, userSelectors } from 'services/user';
import actions, { actionTypes } from './onboard.actions';
import Reducer, { Selectors } from './onboard.reducer';
import Requests from './onboard.requests';
import Epics from './onboard.epics';


const reducer = Reducer(actionTypes, userActionTypes);
const selectors = Selectors();
const requests = Requests(request, BASE_API_PATH);
const epics = combineEpics(...Object.values(Epics({
	Observable,
	localStorage,
	ga,
	logger,
	requests,
	expBackoff,
	actions,
	actionTypes,
	selectors,
	userActions,
	userSelectors,
})));

export {
	epics as onboardEpics,
	reducer as onboardReducer,
	actions as onboardActions,
	selectors as onboardSelectors,
};
