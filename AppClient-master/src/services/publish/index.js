import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import localStorage from 'localStorage';

import ga from 'services/googleAnalytics';
import { videoLayouts, alerts } from 'constants/broadcast';
import { broadcastActions, broadcastActionTypes, broadcastSelectors } from 'services/broadcast';
import { videoActions, videoActionTypes } from 'services/video';

import actions, { actionTypes } from './publish.actions';
import Reducer, { Selectors } from './publish.reducer';
import Epics from './publish.epics';


const reducer = Reducer({ actionTypes, broadcastActionTypes, videoActionTypes });

const selectors = Selectors(createSelector);

const epics = Epics({
	Observable,
	combineEpics,
	selectors,
	actions,
	actionTypes,
	videoActions,
	videoActionTypes,
	broadcastSelectors,
	broadcastActions,
	broadcastActionTypes,
	videoLayouts,
	alerts,
	localStorage,
	ga,
});

export {
	epics as publishEpics,
	reducer as publishReducer,
	actions as publishActions,
	selectors as publishSelectors,
};
