import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import store from 'store';
import history from 'history';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { alertTypes } from 'constants/index';
import { actionTypes } from 'services/notification/notification.actions';
import Startup from '..';

const initRedux = () => {
	if (!store.getState().notification.messages[0]) {
		store.dispatch({
			type: actionTypes.ADD_MSG,
			payload: {
				name: 'TEST_INFO',
			},
		});

		store.dispatch({
			type: actionTypes.ADD_MSG,
			payload: {
				name: 'TEST_ERROR',
			},
		});

		store.dispatch({
			type: actionTypes.ADD_MSG,
			payload: {
				name: 'TEST_SUCCESS',
			},
		});

		store.dispatch({
			type: actionTypes.ADD_MSG,
			payload: {
				name: 'custom_id',
				text: 'Custom message! Example of non standard notification message (text only)',
				type: alertTypes.INFO,
			},
		});

		/*
			// This example will replace 'custom_id' notification
			store.dispatch({
				type: actionTypes.ADD_MSG,
				payload: {
					name: 'custom_id',
					text: 'Test',
					type: alertTypes.SUCCESS,
				},
			});
		*/
	}
};

storiesOf('General', module)
	.addDecorator(withKnobs)
	.addDecorator(getStory => (
		<Provider store={store}>
			<Router history={history}>
				{getStory()}
			</Router>
		</Provider>
	))

	.add('Notifications', withInfo({
		text: 'Some test notifications',
	})(() => (
		<Startup>
			<div>
				{initRedux()}
				<h1>Test</h1>
			</div>
		</Startup>
	)));
