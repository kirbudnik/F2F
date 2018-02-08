import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import store from 'store';
import history from 'history';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Startup from 'components/Startup';
import Info from '..';

storiesOf('Info template', module)
	.addDecorator(withKnobs)
	.addDecorator(getStory => (
		<Provider store={store}>
			<Router history={history}>
				{getStory()}
			</Router>
		</Provider>
	))

	.add('View', withInfo({
		text: 'Info template view',
	})(() => (
		<Startup>
			<Info coverSrc={text('coverSrc', 'images/banner/contact.jpg')}>
				<h1>{text('children.h1', 'Header')}</h1>
				<p>{text('children.p', 'text')}</p>
			</Info>
		</Startup>
	)));
