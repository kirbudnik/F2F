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
import ChannelContainer, { Channel } from '..';

storiesOf('Channel', module)
	.addDecorator(withKnobs)
  .addDecorator(getStory => (
		<Provider store={store}>
			<Router history={history}>
				{getStory()}
			</Router>
		</Provider>
	))

	.add('View', withInfo({
		text: 'Channel view',
	})(() => (
		<Startup>
			<Channel
				content={{
					isOwner: boolean('content.isOwner', true),
					about: text('content.about', 'About this channel'),
					avatarSrc: text('content.avatarSrc', 'http://i.imgur.com/F32TzLY.png'),
					coverSrc: text('content.coverSrc', 'http://i.imgur.com/czF0bnq.png'),
					name: text('content.name', 'Business for Beginners'),
					owner: {
						about: text('content.owner.about', 'About owner'),
						avatarSrc: text('content.owner.avatarSrc', 'http://i.imgur.com/F32TzLY.png'),
						username: text('content.owner.username', 'Username'),
					},
					socialIcons: [
						{
							network: 'twitter',
							link: 'https://twitter.com/',
						},
						{
							network: 'instagram',
							link: 'https://www.instagram.com/',
						},
						{
							network: 'mail',
							link: 'mailto:contact@f2f.live',
						},
					],
				}}
				match={{
					params: {
						username: 'Username',
						channelName: 'ChannelName',
					},
				}}
				payButton={{
					isStripeConnected: boolean('payButton.isStripeConnected', true),
					btnLocations: { channel: true },
					btnText: text('payButton.btnText', 'Donate'),
					btnColor: select('payButton.btnColor', PAY_BTN_COLORS, PAY_BTN_COLORS[0]),
					isCustomAmountOn: boolean('payButton.isCustomAmountOn', true),
					descriptionText: text('payButton.descriptionText', 'Donate! Please, please!!!'),
					presetAmounts: [100, 1000, 10000],
				}}
				hasContentLoaded={boolean('hasContentLoaded', true)}
				isAvatarUploading={boolean('isAvatarUploading', false)}
				isCoverUploading={boolean('isCoverUploading', false)}
				deleteChannel={action('deleteChannel')}
				saveAbout={action('saveAbout')}
				showBroadcast={action('showBroadcast')}
				startBroadcast={action('startBroadcast')}
				uploadAvatar={action('uploadAvatar')}
				uploadCover={action('uploadCover')}
				payWithStripe={action('payWithStripe')}
			/>
		</Startup>
	)))

	.add('Container', withInfo({
		text: 'Channel container',
	})(() => {
		const Page = PageHoc(ChannelContainer);
		return (
			<Startup>
				<Page
					history={history}
					location={{
						key: 'test',
						pathname: 'designer/ChannelName',
						push: action('push'),
					}}
					match={{
						params: {
							username: 'designer',
							channelName: 'ChannelName',
						},
					}}
				/>
			</Startup>
		);
	}));
