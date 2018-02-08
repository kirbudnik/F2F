import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import store from 'store';
import history from 'history';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { Header } from '..';

storiesOf('Header', module)
	.addDecorator(withKnobs)
	.addDecorator(getStory => (
		<Provider store={store}>
			<Router history={history}>
				{getStory()}
			</Router>
		</Provider>
	))

	.add('View', withInfo({
		text: 'Header view',
	})(() => (
		<Header
			isAuth={boolean('isAuth', true)}
			isDiscoverOpen={boolean('isDiscoverOpen', false)}
			menu={[{
				title: 'username',
				img: 'http://i.imgur.com/F32TzLY.png',
				link: [
					{
						title: 'My Profile',
						link: '#',
					},
					{
						title: 'My Channels',
						link: [
							{
								title: 'Channel 1',
								link: '#',
							},
							{
								title: 'Channel 2',
								link: '#',
							},
						],
					},
					{
						title: 'Logout',
						link: '#',
					},
				],
			}]}
			openLoginModal={action('openLoginModal')}
			toggleDiscover={action('toggleDiscover')}
		/>
	)));
