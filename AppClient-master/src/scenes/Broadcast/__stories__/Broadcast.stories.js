import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import store from 'store';
import history from 'history';
import { broadcastActionTypes } from 'services/broadcast';
import { videoActionTypes } from 'services/video';
import { storiesOf } from '@storybook/react';
import { boolean, number, select, text, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { alerts, userTypes, videoLayouts } from 'constants/broadcast';
import { PAY_BTN_COLORS } from 'constants/settings';
import Startup from 'components/Startup';
import Broadcast from '../Broadcast';
import VideoSection from '../components/VideoSection/VideoSection';
import Video from '../components/Video/Video';
import Queue from '../components/Queue/Queue';

if (!store.getState().broadcast.broadcastId) {
	store.dispatch({
		type: broadcastActionTypes.BROADCAST_JOIN_SUCCESS,
		payload: {
			broadcastId: 'test.-testunlisted',
			broadcastName: 'testunlisted',
			token: 'testToken',
			clientId: 'testClientId',
			isHost: true,
			videoRoomId: 'testRoomId',
			broadcast: {
				id: 'test.-testunlisted',
				layout: 'group',
				isLive: false,
				isUnlisted: true,
				videoRoomId: 'testRoomId',
				hostUsername: 'test',
				isViewerCountOn: true,
				isAutoJoinOn: false,
				isQueueSoundOn: true,
			},
		},
	});

	store.dispatch({
		type: videoActionTypes.ROOM_JOIN_SUCCESS,
		payload: {
			roomId: 'testRoomId',
		},
	});
}

const randomChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const TestQueue = ({ bubblesCount, summonGuest, kickFromQueue }) => (
	<Queue
		publisherClientIds={[]}
		bubbles={Array.from({ length: bubblesCount }, (v, id) => ({
			username: `${randomChars[id % randomChars.length]}Username${id}`,
			clientId: `${id}`,
			videoClientId: `abc${id}`,
			imgSrc: id % 10 === 0 ? 'http://i.imgur.com/F32TzLY.png' : null,
		}))}
		summonGuest={summonGuest}
		kickFromQueue={kickFromQueue}
	/>
);

TestQueue.propTypes = {
	bubblesCount: PropTypes.number.isRequired,
	summonGuest: PropTypes.func.isRequired,
	kickFromQueue: PropTypes.func.isRequired,
};

storiesOf('Broadcast', module)
	.addDecorator(withKnobs)
	.addDecorator(getStory => (
		<Provider store={store}>
			<Router history={history}>
				{getStory()}
			</Router>
		</Provider>
	))

	.add('View', withInfo({
		text: 'Broadcast wrapper',
	})(() => (
		<Startup>
			<Broadcast
				broadcastName={text('broadcastName', 'MyBroadcast')}
				hostUsername={text('hostUsername', 'UserName')}
				avatarSrc={text('avatarSrc', 'http://i.imgur.com/F32TzLY.png')}
				userType={select('userType', Object.values(userTypes), Object.values(userTypes)[0])}
				viewerCount={number('viewerCount', 3)}
				isPayBtnOn={boolean('isPayBtnOn', true)}
				isUnlisted={boolean('isUnlisted', true)}
				isViewerCountOn={boolean('isViewerCountOn', true)}
				closeShareTip={action('closeShareTip')}
				tips={{
					shareLink: false,
				}}
				payButton={{
					isStripeConnected: boolean('payButton.isStripeConnected', true),
					btnLocations: { broadcast: true },
					btnText: text('payButton.btnText', 'Donate'),
					btnColor: select('payButton.btnColor', PAY_BTN_COLORS, PAY_BTN_COLORS[0]),
					isCustomAmountOn: boolean('payButton.isCustomAmountOn', true),
					descriptionText: text('payButton.descriptionText', 'Donate! Please, please!!!'),
					presetAmounts: [100, 1000, 10000],
				}}
				videoSectionComponent={
					<VideoSection
						username={text('videoSection.username', 'User')}
						userType={select('userType', Object.values(userTypes), Object.values(userTypes)[0])}
						videoLayout={select(
							'videoSection.videoLayouts',
							Object.values(videoLayouts),
							Object.values(videoLayouts)[0],
						)}
						isJoinModalOpen={boolean('videoSection.isJoinModalOpen', false)}
						hasYoutubeKey={boolean('hasYoutubeKey', false)}
						isYoutubeLive={boolean('isYoutubeLive', false)}
						localBubbleSrc={text('videoSection.localBubbleSrc', 'http://i.imgur.com/F32TzLY.png')}
						trialStreamId={text('videoSection.trialStreamId', '12345')}
						mics={[
							{ id: 'default', label: 'Default' },
						]}
						cameras={[
							{ id: 'default', label: 'Default' },
							{ id: 'another', label: 'Another camera' },
						]}
						selectedMicId="default"
						selectedCameraId="default"
						settings={[
							{
								id: 'isAutoJoinOn',
								text: 'Guests automatically join',
								value: boolean('settings.isAutoJoinOn', false),
								isDisabled: boolean('settings.isAutoJoinOn.isDisabled', false),
							},
							{
								id: 'isViewerCountOn',
								text: 'Audience can see viewer count',
								value: boolean('settings.isViewerCountOn', true),
							},
							{
								id: 'isOne',
								text: 'Dummy setting 1',
								value: false,
							},
							{
								id: 'isTwo',
								text: 'Dummy setting 2',
								value: false,
							},
							{
								id: 'isAnother',
								text: 'Dummy another setting',
								value: true,
							},
						]}
						match={{
							params: {
								username: 'username',
							},
						}}
						isLive={boolean('isLive', false)}
						isUnlisted={boolean('isUnlisted', true)}
						isMicBtnOn={boolean('videoSection.isMicBtnOn', true)}
						isCameraBtnOn={boolean('videoSection.isCameraBtnOn', true)}
						isScreenBtnOn={boolean('videoSection.isScreenBtnOn', false)}
						viewerCount={number('viewerCount', 3)}
						alerts={[{ name: select('alert', ['', ...Object.values(alerts)], '') }].filter(({ name }) => name)}

						endBroadcast={action('videoSection.endBroadcast')}
						toggleJoinModal={action('toggleJoinModal')}
						selectMic={action('selectMic')}
						selectCamera={action('selectCamera')}
						markAsRead={action('markAsRead')}
						markAsViewed={action('markAsViewed')}
						micBtnClick={action('micBtnClick')}
						cameraBtnClick={action('cameraBtnClick')}
						changeSetting={action('changeSetting')}
						screenBtnClick={action('screenBtnClick')}
						layoutBtnClick={action('layoutBtnClick')}
						trialPublish={action('trialPublish')}
						joinQueue={action('joinQueue')}
						leaveQueue={action('leaveQueue')}
						attachVideoElement={action('attachVideoElement')}
						bindAudioListener={action('bindAudioListener')}
						unbindAudioListener={action('unbindAudioListener')}
						closeAlert={action('closeAlert')}
						downloadExtension={action('downloadExtension')}
						settingClicked={action('settingClicked')}
						youtubeBtnClick={action('youtubeBtnClick')}


						videoComponent={
							<Video
								attachVideoElement={action('video.attachVideoElement')}
								avatarSrc={text('avatarSrc', 'http://i.imgur.com/F32TzLY.png')}
								bindAudioListener={action('video.bindAudioListener')}
								broadcastName={text('broadcastName', 'MyBroadcast')}
								goLiveClick={action('video.goLiveClick')}
								hasYoutubeKey={boolean('video.hasYoutubeKey', true)}
								hostUsername={text('hostUsername', 'UserName')}
								isDeviceAccessGranted={boolean('video.isDeviceAccessGranted', true)}
								isLive={boolean('isLive', false)}
								isSpeakerSelectionSupported={boolean('video.isSpeakerSelectionSupported', true)}
								isUnlisted={boolean('isUnlisted', true)}
								isYoutubeLive={boolean('isYoutubeLive', false)}
								selectSpeaker={action('selectSpeaker')}
								selectedSpeakerId="default"
								setVolume={action('video.setVolume')}
								speakers={[
									{ id: 'default', label: 'Default' },
									{ id: 'another', label: 'Another speaker' },
								]}
								streams={[]}
								unsummonGuest={action('video.unsummonGuest')}
								userType="host"
								volume={number('video.volume', 60)}
								youtubeBtnClick={action('youtubeBtnClick')}
							/>
						}

						queueComponent={
							<TestQueue
								bubblesCount={number('queue.bubblesCount', 30)}
								summonGuest={action('queue.summonGuest')}
								kickFromQueue={action('queue.kickFromQueue')}
							/>
						}
					/>
				}
			/>
		</Startup>
	)));
