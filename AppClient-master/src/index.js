import 'polyfill';
import 'rxjs';
import React from 'react';
import ReactDom from 'react-dom';

import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import history from 'history';
import store from 'store';

import Startup from 'components/Startup';
import PageHoc from 'PageHoc';
import Logout from 'components/Logout';
import Spinner from 'components/Spinner';
import OauthRedirect from 'components/OauthRedirect';
import Contact from 'scenes/Contact';
import Channel from 'scenes/Channel';
import Landing from 'scenes/Landing';
import Profile from 'scenes/Profile';
import ErrorPage from 'scenes/ErrorPage';
import Settings from 'scenes/Settings';
import NotFound from 'scenes/NotFound';
import Terms from 'scenes/Terms';

// Create a "global" rollbar instance that will catch uncaught exceptions / promises
import 'services/rollbar';

// TODO - Impliment google analytics
import 'services/googleAnalytics';

// Global styles
import './static/styles/styles.scss';

// Load mock api for front-end dev
import './mockRequests';


const Main = () => (
	<Startup>
		<Switch>
			<Route exact path='/' component={Landing} />
			<Route exact path='/terms' component={Terms} />
			<Route exact path='/contact' component={Contact} />
			<Route exact path='/error' component={ErrorPage} />
			<Route exact path='/settings/:page?/:subpage?' component={Settings} />
			<Route exact path='/:username/-:channelName' component={PageHoc(Spinner)} />
			<Route exact path='/:username/:channelName' component={PageHoc(Channel)} />
			<Route exact path='/:username' component={PageHoc(Profile)} />
			<Route exact path='*' component={NotFound} />
		</Switch>
	</Startup>
);

const jsx = (
	<Provider store={store}>
		<Router history={history}>
			<Switch>
				<Route exact path='/redirect' component={OauthRedirect} />
				<Route exact path='/api/logout' component={Logout} />
				<Route path="/" component={Main} />
			</Switch>
		</Router>
	</Provider>
);


ReactDom.render(
	jsx,
	document.getElementById('app'),
);
