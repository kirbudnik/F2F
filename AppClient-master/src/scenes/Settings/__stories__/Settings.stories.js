import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import store from 'store';
import history from 'history';
import StoryRouter from 'storybook-router';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Startup from 'components/Startup';
import Settings from '..';

const SettingsRoute = props => (
	<Settings
		{...props}
	/>
);

storiesOf('Settings', module)
	.addDecorator(withKnobs)
	.addDecorator(StoryRouter(null, { initialEntries: ['/settings'] }))
	.addDecorator(getStory => (
		<Provider store={store}>
			<Router history={history}>
				{getStory()}
			</Router>
		</Provider>
	))

	.add('Container', withInfo({
		text: 'Settings container',
	})(() => (
		<Startup>
			<Route path="/settings/:page?/:subpage?" component={SettingsRoute} />
		</Startup>
	)));
