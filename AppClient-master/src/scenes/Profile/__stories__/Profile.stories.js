import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import store from 'store';
import history from 'history';
import PageHoc from 'PageHoc';
import { PAY_BTN_COLORS } from 'constants/settings';
import { storiesOf } from '@storybook/react';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import Startup from 'components/Startup';
import ProfileContainer, { Profile } from '..';

storiesOf('Profile', module)
	.addDecorator(withKnobs)
	.addDecorator(getStory => (
		<Provider store={store}>
			<Router history={history}>
				{getStory()}
			</Router>
		</Provider>
	))

	.add('View', withInfo({
		text: 'Profile view',
	})(() => (
		<Startup>
			<Profile
				content={{
					isOwner: boolean('content.isOwner', true),
					about: text('content.about', 'Text about me'),
					avatarSrc: text('content.avatarSrc'),
					coverSrc: text('content.coverSrc', 'http://i.imgur.com/F32TzLY.png'),
					channels: [
						{
							name: 'BestChannel',
							lowercaseName: 'bestchannel',
							about: 'This is the best channel',
							avatarSrc: 'http://i.imgur.com/F32TzLY.png',
							coverSrc: 'http://i.imgur.com/F32TzLY.png',
						},
						{
							name: 'Mom',
							lowercaseName: 'mom',
							about: 'I talk to my mom on this channel.',
						},
					],
					username: text('content.username', 'Username'),
				}}
				hasContentLoaded={boolean('hasContentLoaded', true)}
				match={{
					params: {
						username: 'Username',
					},
				}}
				payButton={{
					isStripeConnected: boolean('payButton.isStripeConnected', true),
					btnLocations: { profile: true },
					btnText: text('payButton.btnText', 'Donate'),
					btnColor: select('payButton.btnColor', PAY_BTN_COLORS, PAY_BTN_COLORS[0]),
					isCustomAmountOn: boolean('payButton.isCustomAmountOn', true),
					descriptionText: text('payButton.descriptionText', 'Donate! Please, please!!!'),
					presetAmounts: [100, 1000, 10000],
				}}
				isAvatarUploading={boolean('isAvatarUploading', false)}
				isCoverUploading={boolean('isCoverUploading', false)}

				saveAbout={action('saveAbout')}
				showBroadcast={action('showBroadcast')}
				openChannelModal={action('openChannelModal')}
				uploadAvatar={action('uploadAvatar')}
				uploadCover={action('uploadCover')}
				payWithStripe={action('payWithStripe')}
			/>
		</Startup>
	)))

	.add('Container', withInfo({
		text: 'Profile container',
	})(() => {
		const Page = PageHoc(ProfileContainer);
		return (
			<Startup>
				<Page
					history={history}
					location={{
						key: 'test',
						pathname: 'designer',
						push: action('push'),
					}}
					match={{
						params: {
							username: 'designer',
						},
					}}
				/>
			</Startup>
		);
	}));
