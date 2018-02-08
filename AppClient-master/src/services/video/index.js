/* global F2F */
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';

import logger from 'services/logger';

import actions, { actionTypes } from './video.actions';
import Epics from './video.epics';


// F2F library is loaded through an external script.
// It will not exist when running storybook.
const f2f = typeof F2F !== 'undefined' ? F2F() : null;
const f2fErrors = f2f ? f2f.errors : {};

const epics = combineEpics(...Object.values(Epics({
	Observable,
	actions,
	actionTypes,
	f2f,
	logger,
	options: {
		deviceRefreshInterval: 1000,
		systemReportInterval: 1000,
	},
})));


export {
	actions as videoActions,
	actionTypes as videoActionTypes,
	epics as videoEpics,
	f2fErrors as videoErrors,
};
