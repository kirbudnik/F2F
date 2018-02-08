import { applyMiddleware, createStore, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './rootReducer';
import rootEpic from './rootEpic';

const composeEnhancers = process.env.NODE_ENV !== 'production'
	&& typeof window === 'object'
	&& window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-underscore-dangle
	? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-underscore-dangle
	: compose;

const epicMiddleware = createEpicMiddleware(rootEpic);

const middleware = applyMiddleware(epicMiddleware);

const store = createStore(rootReducer, {}, composeEnhancers(middleware));

export default store;
