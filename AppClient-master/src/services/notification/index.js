import { combineEpics } from 'redux-observable';

import ga from 'services/googleAnalytics';
import actions, { actionTypes } from './notification.actions';
import Reducer, { Selectors } from './notification.reducer';
import Epics from './notification.epics';

const reducer = Reducer(actionTypes);
const selectors = Selectors();
const epics = combineEpics(...Object.values(Epics({
	actionTypes,
	ga,
})));

export {
	reducer as notificationReducer,
	actions as notificationActions,
	selectors as notificationSelectors,
	epics as notificationEpics,
};
