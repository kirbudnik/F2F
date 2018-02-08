import React from 'react';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { Link } from 'react-router-dom';
import Tooltip from 'rc-tooltip';
import {
	videoLayouts,
	userTypes,
	alerts as alertNames,
	MAX_STREAMS_PER_ROOM,
} from 'constants/broadcast';
import {
	browserDownloads,
	alertTypes,
	CHROME_EXTENSION_LINK,
	YOUTUBE_ENABLE_STREAMING_LINK,
} from 'constants/index';

import {
	ChatAlt,
	DeviceCamera,
	DeviceCameraOff,
	DeviceMic,
	DeviceMicOff,
	GroupSet,
	HostSet,
	Layouts,
	NewsSet,
	PresentationSet,
	Queue as QueueIcon,
	Restream,
	RotateCamera,
	ScreenSet,
	SettingsAlt,
	ShareScreen,
	SoloSet,
	X,
	YoutubeLive,
} from 'components/Icons';

import Avatar from 'components/Avatar';
import FlatButton from 'components/FlatButton';
import Modal from 'components/Modal';
import NotificationMsg from 'components/NotificationMsg';
import Switch from 'components/Switch';
import AsideButton from '../AsideButton';
import DeviceIcon from '../DeviceIcon';
import JoinProcess from '../JoinProcess';
import Queue from '../Queue';
import Video from '../Video';
import Chat from '../Chat';
import ChatNotification from './components/ChatNotification';
import QueueNotification from './components/QueueNotification';
import styles from './VideoSection.scss';

const iconSocialLive = {
	strokeWidth: 0,
	size: 22,
	fill: '#fff',
};

const dropTarget = {
	canDrop(props, monitor) {
		return !!monitor.getItem();
	},

	drop(props, monitor) {
		const item = monitor.getItem();
		props.onUserAdd(item);
	},
};

const reload = () => window.location.reload();

const rightTabs = {
	CHAT: 'chat',
	SETTINGS: 'settings',
	RESTREAM: 'restream',
	QUEUE: 'queue',
};


/* eslint-disable react/display-name, react/prop-types */
const alertDefs = ({ downloadExtension }) => ({
	[alertNames.SERVER_ERROR]: {
		text: () => <span>Something ain&apos;t working right on our end. Sorry about that.
			Try refreshing the page and please <Link to="/contact">contact us</Link>
			{' '}if this continues.</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.WEBRTC_NO_IOS]: {
		text: () => <span>Your device doesn&apos;t fully support our video techonology.
			We&apos;re working to get around this, but for now, we ask that you use a
			laptop or desktop to connect.</span>,
		type: alertTypes.INFO,
	},
	[alertNames.WEBRTC_UPDATE_IOS]: {
		text: () => <span>Our technology requires iOS 11 to run in the browser.
			Please upgrade if possible.</span>,
		type: alertTypes.INFO,
	},
	[alertNames.WEBRTC_UNSUPPORTED_BROWSER]: {
		text: () => <span>This browser doesn&apos;t support live broadcasting.
			We highly recommend downloading
			{' '}<a target="_blank" rel="noopener noreferrer" href={browserDownloads.CHROME}>Chrome</a> or
			{' '}<a target="_blank" rel="noopener noreferrer" href={browserDownloads.FIREFOX}>Firefox</a>
			</span>,
		type: alertTypes.INFO,
	},
	[alertNames.WEBRTC_UPDATE_BROWSER]: {
		text: () => <span>It looks like you&apos;re on an older browser version.
			To use F2F, we ask that you update your browser to the most recent version.</span>,
		type: alertTypes.INFO,
	},
	[alertNames.WEBRTC_UNSUPPORTED]: {
		text: () => <span>Unfortunately, our video technology will not work on this device.
			Please try using a different device. F2F performs best on laptops/desktops in
			Chrome or Firefox.</span>,
		type: alertTypes.INFO,
	},
	[alertNames.VIEWER_ROOM_IS_FULL]: {
		text: () => <span>
			F2F has temporarily set a hard limit on the total number of people that can view
			a broadcast and this broadcast is completely full!
			A space will open up for you as soon as someone leaves.
			</span>,
		type: alertTypes.INFO,
	},
	[alertNames.ROOM_NOT_FOUND]: {
		text: ({ isHost }) => <span>We&apos;re having trouble connecting you to the broadcast.
			Please try refreshing the page.
			{isHost && ' You may want to end the broadcast and restart it if this continues.'}
			</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.SUMMON_ROOM_IS_FULL]: {
		text: () => <span>
			We limit each broadcast to {MAX_STREAMS_PER_ROOM} total feeds.
			Please remove a guest or stop one of your own feeds before adding
			another guest.
			</span>,
		type: alertTypes.INFO,
	},
	[alertNames.SUMMON_FAILED]: {
		text: () => <span>
			Unable to add your guest into the broadcast. If this persists, please try
			refreshing the page.
			</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.PUBLISHER_WEBRTC_FAILED]: {
		text: () => <span>There was an issue connecting your stream.
			Please try switching browsers or devices if this persists.</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.PUBLISHER_ROOM_IS_FULL]: {
		text: () => <span>
			We limit each broadcast to {MAX_STREAMS_PER_ROOM} total feeds.
			You&apos;ll be able to join once another stream has stopped.
			</span>,
		type: alertTypes.INFO,
	},
	[alertNames.DEVICES_NO_MIC]: {
		text: () => <span>We couldn&apos;t find a microphone.
			Is it possible you don&apos;t have one plugged in?</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.DEVICES_NO_CAMERA]: {
		text: () => <span>Couldn&apos;t find a camera.
			Is it possible you don&apos;t have one plugged in?</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.DEVICES_NO_AUDIO]: {
		text: () => <span>We&apos;re having trouble hearing you. Do you have the right mic
			selected?</span>,
		type: alertTypes.INFO,
	},
	[alertNames.DEVICES_NOT_SENDING_AUDIO]: {
		text: () => <span>We&apos;ve lost connection to your mic. Please make sure you have
			the right mic selected. If so, then this is likely a browser issue.
			Try restarting your browser.</span>,
		type: alertTypes.INFO,
	},
	[alertNames.DEVICES_FACE_TIME_CAMERA_BLOCKED]: {
		text: () => <span>Can&apos;t seem to access your devices.
			Is it possible they are being used by another program? If not, try following
			{' '}<a
					href="http://blog.fosketts.net/2016/11/24/2016-macbook-pro-facetime-hd-camera-not-working/"
					target="_blank"
					rel="noopener noreferrer"
				>
					this guide.
				</a>
			</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.DEVICES_ACCESS_DENIED]: {
		text: () => <span>You&apos;ve blocked f2f from using your devices.
			You can unblock us from your browser settings. For most browsers,
			click the video icon at the top of your page</span>,
		type: alertTypes.INFO,
	},
	[alertNames.DEVICES_NOT_READABLE]: {
		text: () => <span>Can&apos;t seem to access your devices.
			Is it possible they are being used by another program?</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.DEVICES_CAPTURE_FAILED]: {
		text: () => <span>Can&apos;t seem to access your devices.
			Try re-plugging them or refreshing the page. Please
			{' '}<Link to="/contact" target="_blank">reach out</Link> if the issue persists</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.SCREEN_UNSUPPORTED_BROWSER]: {
		text: () => <span>Your current browser doesnt support screen sharing. Please use
			{' '}<a target="_blank" rel="noopener noreferrer" href={browserDownloads.CHROME}>Chrome</a> or
			{' '}<a target="_blank" rel="noopener noreferrer" href={browserDownloads.FIREFOX}>Firefox</a> to
			share your screen</span>,
		type: alertTypes.INFO,
	},
	[alertNames.SCREEN_UPDATE_BROWSER]: {
		text: () => <span>You&apos;ll need to update your browser to the most recent version in
			order to share your screen on F2F</span>,
		type: alertTypes.INFO,
	},
	[alertNames.SCREEN_NO_EXTENSION]: {
		text: () => <span>A simple chrome extension is required to share your screen.
			{' '}<a onClick={downloadExtension}>Click here</a> to get it</span>,
		type: alertTypes.INFO,
	},
	[alertNames.SCREEN_UNSUPPORTED]: {
		text: () => <span>Screen sharing is not supported on this device</span>,
		type: alertTypes.INFO,
	},
	[alertNames.SCREEN_ACCESS_DENIED]: {
		text: () => <span>You&apos;ve blocked f2f from accessing your screen.
			You can unblock us from your browser settings. For most browsers,
			click the screen icon at the top of your page</span>,
		type: alertTypes.INFO,
	},
	[alertNames.SCREEN_CAPTURE_FAILED]: {
		text: () => <span>We can&apos;t seem to access your screen.
			Try capturing a different screen to see if the issue persists.
			Please <Link to="/contact" target="_blank">get in touch</Link> if this continues
			to be a problem for you. We&apos;re here to help.</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.EXTENSION_DOWNLOAD_SUCCESS]: {
		text: () => <span>Awesome! You got it. <a onClick={reload}>Refresh</a> your
		page for the change to take effect</span>,
		type: alertTypes.SUCCESS,
	},
	[alertNames.EXTENSION_DOWNLOAD_FAILED]: {
		text: () => <span className={styles.span}> Aww... the download failed. Don&apos;t worry,
			hope is not lost! Simply
			{' '}<a target="_blank" rel="noopener noreferrer" href={CHROME_EXTENSION_LINK}>add</a>
			{' '}the extension directly from the webstore, then <a onClick={reload}>refresh</a>
			{' '}your page
			</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.RESTREAM_FAILED]: {
		text: () => <span>Restreaming might not be working as expected. Please check your live stream
			to ensure everything is okay. Please
			{' '}<Link to="/contact" target="_blank">get in touch</Link> if this persists.</span>,
		type: alertTypes.ERROR,
	},
	// Restream
	[alertNames.RESTREAM_KEY_FAILED]: {
		text: ({ platform }) => <span>We&apos;re having trouble getting your stream key
			from {platform}. Try refreshing the page and <Link to="/contact">contact us</Link>
			{' '}if this persists.</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.RESTREAM_STOPPED]: {
		text: () => <span>Heads up! We&apos;re having trouble restreaming the broadcast.
			Please check your live stream to ensure everything is okay.</span>,
		type: alertTypes.ERROR,
	},
	[alertNames.RESTREAM_ENABLE_YOUTUBE]: {
		text: () => <span>You&apos;ll first need to
			{' '}<a href={YOUTUBE_ENABLE_STREAMING_LINK} target="_blank" rel="noopener noreferrer">
				enable live streaming
			</a>
			{' '}on your YouTube account.
			Don&apos;t hesitate to <Link to="/contact">reach out</Link>
			{' '}if you have any questions.</span>,
		type: alertTypes.INFO,
	},
	// Queue
	[alertNames.QUEUE_JOIN_FAILED]: {
		text: () => <span>We&apos;re having trouble adding you to the host&apos;s queue.
			Try refreshing the page and <Link to="/contact">contact us</Link>
			{' '}if this continues.</span>,
		type: alertTypes.INFO,
	},
	// Chat
	[alertNames.CHAT_SUBMIT_FAILED]: {
		text: () => <span>We&apos;re having trouble sending your chat message.
			Try refreshing the page if this continues.</span>,
		type: alertTypes.INFO,
	},
});
/* eslint-enable react/display-name, react/prop-types */


const layouts = [
	{
		layout: videoLayouts.GROUP,
		icon: GroupSet,
		text: 'Group',
	},
	{
		layout: videoLayouts.HOST,
		icon: HostSet,
		text: 'Host',
	},
	{
		layout: videoLayouts.SOLO,
		icon: SoloSet,
		text: 'Solo',
	},
	{
		layout: videoLayouts.NEWS,
		icon: NewsSet,
		text: 'News',
		hideMobile: true,
	},
	{
		layout: videoLayouts.SCREEN,
		icon: ScreenSet,
		text: 'Screen',
		hideMobile: true,
	},
	{
		layout: videoLayouts.PRESENTATION,
		icon: PresentationSet,
		text: 'Presentation',
		hideMobile: true,
	},
];

const getInitialRightTab = nextProps =>
	(nextProps.userType === userTypes.HOST && !nextProps.isLive
			? rightTabs.SETTINGS
			: rightTabs.CHAT);

class VideoSection extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeRightTab: getInitialRightTab(props),
			isEndModalOpen: false,
			layoutBtnOpen: false,
		};

		this.alerts = alertDefs(props);

		this.endBroadcast = this.endBroadcast.bind(this);
		this.clickOutside = this.clickOutside.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
		this.closeLayoutTooltip = this.closeLayoutTooltip.bind(this);
		this.closeRightAside = this.closeRightAside.bind(this);
		this.layoutBtnClick = this.layoutBtnClick.bind(this);
		this.rotatetCameraDevice = this.rotatetCameraDevice.bind(this);
		this.toggleRightAside = this.toggleRightAside.bind(this);
		this.toggleChat = this.toggleChat.bind(this);
		this.toggleEndModal = this.toggleEndModal.bind(this);
		this.toggleJoinModal = this.toggleJoinModal.bind(this);
		this.toggleRestream = this.toggleRestream.bind(this);
		this.toggleSettings = this.toggleSettings.bind(this);
		this.toggleQueue = this.toggleQueue.bind(this);
		this.isTabVisible = this.isTabVisible.bind(this);
		this.setLayoutTooltipRef = this.setLayoutTooltipRef.bind(this);
		this.setSettingsRef = this.setSettingsRef.bind(this);
		this.setSettingsListRef = this.setSettingsListRef.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mouseup', this.clickOutside);

		if (this.settingsRef) {
			this.settingsScroll = new SimpleBar(this.settingsRef);
		}

		if (this.settingsListRef) {
			this.settingsListScroll = new SimpleBar(this.settingsListRef);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.userType !== this.props.userType) {
			this.setState({ activeRightTab: getInitialRightTab(nextProps) });
		}

		if (
				nextProps.isLive &&
				!this.props.isLive &&
				this.state.activeRightTab === rightTabs.SETTINGS) {
			this.setState({ activeRightTab: rightTabs.CHAT });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.activeRightTab !== rightTabs.SETTINGS
			&& this.state.activeRightTab === rightTabs.SETTINGS
			&& this.settingsListRef
		) {
			this.settingsListScroll = new SimpleBar(this.settingsListRef);
		}
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.clickOutside);
	}

	endBroadcast() {
		const { innerWidth } = window;

		if (this.props.viewerCount <= 1 || innerWidth >= 768) {
			this.props.endBroadcast();
		} else {
			this.toggleEndModal();
		}
	}

	clickOutside(event) {
		if (this.state.layoutBtnOpen
			&& this.layoutTooltipRef
			&& !this.layoutTooltipRef.contains(event.target)
		) {
			this.closeLayoutTooltip();
		}
	}

	closeAlert(name) {
		this.props.closeAlert({ name });
	}

	closeLayoutTooltip() {
		if (this.state.layoutBtnOpen) {
			this.setState({ layoutBtnOpen: false });
		}
	}

	closeRightAside() {
		this.toggleRightAside(false);
	}

	layoutBtnClick() {
		this.setState({ layoutBtnOpen: !this.state.layoutBtnOpen });
	}

	rotatetCameraDevice() {
		const { cameras, selectedCameraId, selectCamera } = this.props;
		const camerasIds = cameras.map(({ id }) => id);
		const index = camerasIds.indexOf(selectedCameraId);

		selectCamera(camerasIds[index + 1] || camerasIds[0]);
	}

	toggleRightAside(tabName) {
		const { activeRightTab } = this.state;

		if (tabName === rightTabs.CHAT || activeRightTab === rightTabs.CHAT) {
			this.props.markAsRead();
		}

		if (activeRightTab === rightTabs.QUEUE) {
			this.props.markAsViewed();
		}

		this.setState({
			activeRightTab: tabName && activeRightTab !== tabName ? tabName : false,
			lastActiveRightTab: activeRightTab,
		});
	}

	toggleChat() {
		this.toggleRightAside(rightTabs.CHAT);
	}

	toggleEndModal() {
		this.setState({ isEndModalOpen: !this.state.isEndModalOpen });
	}

	toggleJoinModal() {
		this.props.toggleJoinModal({ isOpen: !this.props.isJoinModalOpen });
	}

	toggleRestream() {
		this.toggleRightAside(rightTabs.RESTREAM);
	}

	toggleSettings() {
		this.toggleRightAside(rightTabs.SETTINGS);
	}

	toggleQueue() {
		this.toggleRightAside(rightTabs.QUEUE);
	}

	isTabVisible(tab) {
		const { activeRightTab, lastActiveRightTab } = this.state;
		return activeRightTab === tab || (!activeRightTab && lastActiveRightTab === tab);
	}

	setLayoutTooltipRef(c) {
		this.layoutTooltipRef = c;
	}

	setSettingsRef(c) {
		this.settingsRef = c;
	}

	setSettingsListRef(c) {
		this.settingsListRef = c;
	}

	render() {
		const {
			alerts,
			cameras,
			isCameraBtnOn,
			isJoinModalOpen,
			isMicBtnOn,
			isScreenBtnOn,
			joinQueue,
			layoutBtnClick,
			leaveQueue,
			localBubbleSrc,
			mics,
			settings,
			trialPublish,
			trialStreamId,
			username,
			userType,
			videoLayout,
			isUnlisted,
			isLive,
			isYoutubeLive,
			hasYoutubeKey,

			queueComponent,
			videoComponent,

			attachVideoElement,
			bindAudioListener,
			cameraBtnClick,
			settingClicked,
			connectDropTarget,
			micBtnClick,
			screenBtnClick,
			selectCamera,
			selectedCameraId,
			selectedMicId,
			selectMic,
			unbindAudioListener,
			youtubeBtnClick,
		} = this.props;

		const { activeRightTab, isEndModalOpen, layoutBtnOpen } = this.state;

		const isGuest = userType === userTypes.GUEST;
		const isQueue = userType === userTypes.QUEUE;
		const isViewer = userType === userTypes.VIEWER;
		const isHost = userType === userTypes.HOST;

		const showSettings = settings && isHost;

		let asideWidth = activeRightTab ? 438 : 118;
		if (!isHost && !isGuest) {
			asideWidth -= 80;
		}

		const queue = queueComponent || <Queue />;

		const layoutButtons = isHost && (
			<div>
				{layouts.map(({ layout, text, icon, hideMobile }) => (
					<AsideButton
						key={layout}
						callbackArgument={layout}
						text={text}
						icon={React.createElement(icon)}
						isActive={videoLayout === layout}
						onClick={layoutBtnClick}
						className={classNames(hideMobile && styles.hideMobile)}
					/>
				))}
			</div>
		);

		const leaveButton = (
			<FlatButton onClick={leaveQueue} className={styles.button}>
				Leave
			</FlatButton>
		);

		const endButton = (
			<FlatButton className={styles.button} onClick={this.endBroadcast}>
				<span>End
					{' '}<span className="show-medium">
						{isUnlisted ? 'Meeting' : 'Broadcast'}
					</span>
				</span>
			</FlatButton>
		);

		return (
			<div className={classNames(
				styles.wrap,
				!showSettings && styles.hideMobileFooter,
				activeRightTab && styles.withActiveTab,
			)}>
				{connectDropTarget((
					<section className={styles.section}>
						{videoComponent || <Video asideWidth={asideWidth} />}
						<div className={styles.alerts}>
							{alerts
								.map(alert => ({ ...alert, ...this.alerts[alert.name] }))
								.map(({ name, args, text, type }) => (
									<NotificationMsg
										key={name}
										name={name}
										type={type}
										onRequestClose={this.closeAlert}
									>
										{text(args)}
									</NotificationMsg>
							))}
						</div>
					</section>
				))}
				{isViewer &&
					<aside className={styles.settingsMobile}>
						<div className={styles.mediumToFooter}>
							<FlatButton
								onClick={this.toggleJoinModal}
								className={classNames(styles.button, styles.alt)}
							>
								Join
							</FlatButton>
						</div>
					</aside>
				}
				{isQueue &&
					<aside className={styles.settingsMobile}>
						<div className={classNames(styles.group, styles.mediumToFooter)}>
							<Avatar
								title={username || 'User'}
								size="small" src={localBubbleSrc}
							/>
							<p>
								You are in the host’s queue.<br />
								You may be added at any time.
							</p>
							<div>
								<button onClick={leaveQueue} className={classNames(styles.button, styles.gray)}>
									Leave <span className="show-medium">Queue</span>
								</button>
							</div>
						</div>
					</aside>
				}
				{(isHost || isGuest) &&
					<aside
						className={styles.settings}
						ref={this.setSettingsRef}
					>
						<div className={classNames(styles.inner, !isHost && styles.center)}>
							<div>
								{cameras.length > 1 &&
									<AsideButton
										icon={<RotateCamera fill="#fff" size={26} className={styles.rotateIcon} />}
										isActive={false}
										onClick={this.rotatetCameraDevice}
										className="hide-medium"
									/>
								}
								<AsideButton
									icon={<DeviceIcon
										disabledIcon={DeviceCameraOff}
										enabledIcon={DeviceCamera}
										devices={cameras}
										isEnabled={isCameraBtnOn}
										selectedDeviceId={selectedCameraId}
										onDeviceSelect={selectCamera}
									/>}
									isActive={isCameraBtnOn}
									onClick={cameraBtnClick}
								/>
								<AsideButton
									icon={<DeviceIcon
										disabledIcon={DeviceMicOff}
										enabledIcon={DeviceMic}
										devices={mics}
										isEnabled={isMicBtnOn}
										selectedDeviceId={selectedMicId}
										onDeviceSelect={selectMic}
									/>}
									isActive={isMicBtnOn}
									onClick={micBtnClick}
								/>
								{isHost &&
									<AsideButton
										className="show-medium"
										icon={<ShareScreen />}
										onClick={screenBtnClick}
										isActive={isScreenBtnOn}
									/>
								}
								{isHost &&
									<Tooltip
										placement="top"
										overlay={layoutButtons}
										visible={layoutBtnOpen}
										onClick={this.layoutBtnClick}
									>
										<div ref={this.setLayoutTooltipRef}>
											<AsideButton
												className={classNames(
													styles.layoutBtnWrap,
													layoutBtnOpen && styles.open,
													styles.leftMargin,
													'hide-medium',
												)}
												icon={
													<div className={styles.layoutBtn}>
														<Layouts size={24} fill="#fff" />
														<div>Layout</div>
													</div>
												}
											/>
										</div>
									</Tooltip>
								}
								{(isHost || isGuest) &&
									<div className={classNames(styles.leftMargin, 'hide-medium')}>
										{isHost && endButton}
										{isGuest && leaveButton}
									</div>
								}
							</div>
							<div className="show-medium">
								{layoutButtons}
							</div>
						</div>
					</aside>
				}
				<aside
					className={classNames(
						styles.asideContent,
						!activeRightTab && styles.unvisible,
						activeRightTab === rightTabs.RESTREAM && 'hide-medium',
						activeRightTab === rightTabs.QUEUE && 'hide',
					)}
				>
					{this.isTabVisible(rightTabs.CHAT) &&
						<div className={styles.landscapePadding}>
							<div className={styles.asideHeader}>
								<h3>Chat</h3>
								<X
									className={classNames(styles.close)}
									onClick={this.closeRightAside}
								/>
							</div>
							<Chat />
						</div>
					}
					{showSettings && this.isTabVisible(rightTabs.SETTINGS) &&
						<div className={styles.settingsListWrap}>
							<div className={styles.asideHeader}>
								<h3>Settings</h3>
								<X
									className={classNames(styles.close)}
									onClick={this.closeRightAside}
								/>
							</div>
							<div ref={this.setSettingsListRef}>
								<ul className={styles.settingsList}>
									{settings.map(({ id, text, value, isDisabled }) => (
										<li
											className={classNames(isDisabled && styles.disabled)}
											key={id}
										>
											<span>{text}</span>
											<Switch
												id={id}
												value={value}
												isDisabled={isDisabled}
												onChange={settingClicked}
											/>
										</li>
									))}
								</ul>
							</div>
						</div>
					}
					{isHost && this.isTabVisible(rightTabs.RESTREAM) &&
						<div>
							<ul className={classNames(styles.settingsList, styles.alt)}>
								<li>
									<span>
										<YoutubeLive {...iconSocialLive} /> Stream to YouTube
									</span>
									<Switch
										id="youtube-mobile-broadcast"
										value={(!isLive && hasYoutubeKey) || (isLive && isYoutubeLive)}
										onChange={youtubeBtnClick}
									/>
								</li>
							</ul>
						</div>
					}
				</aside>
				<aside className={styles.asideButtons}>
					{isHost &&
						<div
							onClick={this.toggleRestream}
							className={classNames(
								styles.rightIcon,
								activeRightTab === rightTabs.RESTREAM && styles.active,
								'hide-medium',
							)}
						>
							<Restream size={20} />
							<h4 className="show-mobile-portrait-only">Restream</h4>
						</div>
					}
					<div
						onClick={this.toggleChat}
						className={classNames(
							styles.rightIcon,
							activeRightTab === rightTabs.CHAT && styles.active,
						)}
					>
						<span className={styles.notifiIconWrap}>
							<ChatAlt size={22} />
							<span style={{ opacity: activeRightTab === rightTabs.CHAT ? 0 : 1 }}>
								<ChatNotification />
							</span>
						</span>
						<h4 className="show-mobile-portrait-only">Chat</h4>
					</div>
					{isHost &&
						<div
							onClick={this.toggleQueue}
							className={classNames(
								styles.rightIcon,
								activeRightTab === rightTabs.QUEUE && styles.active,
								'hide-medium',
							)}
						>
							<span className={styles.notifiIconWrap}>
								<QueueIcon size={25} />
								<span style={{ opacity: activeRightTab === rightTabs.QUEUE ? 0 : 1 }}>
									<QueueNotification />
								</span>
							</span>
							<h4 className="show-mobile-portrait-only">Queue</h4>
						</div>
					}
					{showSettings &&
						<div
							onClick={this.toggleSettings}
							className={classNames(
								styles.rightIcon,
								activeRightTab === rightTabs.SETTINGS && styles.active,
							)}
						>
							<SettingsAlt size={22} />
							<h4 className="show-mobile-portrait-only">Settings</h4>
						</div>
					}
				</aside>
				<footer
					className={classNames(styles.footer, activeRightTab !== rightTabs.QUEUE && 'show-medium')}
				>
					<div className={styles.footerInner}>
						{isHost && queue}
						{isViewer &&
							<Modal isOpen={isJoinModalOpen} onRequestClose={this.toggleJoinModal}>
								<JoinProcess
									trialStreamId={trialStreamId}
									mics={mics}
									cameras={cameras}
									selectedMicId={selectedMicId}
									selectedCameraId={selectedCameraId}
									selectMic={selectMic}
									selectCamera={selectCamera}
									trialPublish={trialPublish}
									attachVideoElement={attachVideoElement}
									bindAudioListener={bindAudioListener}
									unbindAudioListener={unbindAudioListener}
									joinQueue={joinQueue}
								/>
							</Modal>
						}
						{isGuest &&
							<div className={classNames(styles.group, 'show-medium')}>
								{leaveButton}
							</div>
						}
						{isHost && <div className="show-medium">{endButton}</div>}
						{isHost && (
							<Modal
								isOpen={isEndModalOpen}
								type="alert"
							>
								<h3>Are you sure you want to end your {isUnlisted ? 'meeting' : 'broadcast'}?</h3>
								<button onClick={this.toggleEndModal}>NO</button>
								<button onClick={this.props.endBroadcast}>YES</button>
							</Modal>
						)}
					</div>
				</footer>
			</div>
		);
	}
}

VideoSection.propTypes = {
	alerts: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		args: PropTypes.object,
	})).isRequired,
	cameras: PropTypes.array.isRequired,
	isCameraBtnOn: PropTypes.bool,
	isJoinModalOpen: PropTypes.bool.isRequired,
	isLive: PropTypes.bool.isRequired,
	isMicBtnOn: PropTypes.bool,
	isScreenBtnOn: PropTypes.bool,
	hasYoutubeKey: PropTypes.bool,
	isYoutubeLive: PropTypes.bool,
	localBubbleSrc: PropTypes.string,
	match: PropTypes.shape({
		params: PropTypes.shape(),
	}).isRequired,
	mics: PropTypes.array.isRequired,
	selectedCameraId: PropTypes.string,
	selectedMicId: PropTypes.string,
	isUnlisted: PropTypes.bool,
	settings: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired,
		value: PropTypes.bool.isRequired,
		isDisabled: PropTypes.bool,
	})),
	trialStreamId: PropTypes.string,
	username: PropTypes.string,
	userType: PropTypes.oneOf(Object.values(userTypes)),
	viewerCount: PropTypes.number,
	videoLayout: PropTypes.string,

	// We use it to render Video in tests
	queueComponent: PropTypes.node,
	videoComponent: PropTypes.node,

	// Actions
	attachVideoElement: PropTypes.func.isRequired,
	bindAudioListener: PropTypes.func.isRequired,
	cameraBtnClick: PropTypes.func.isRequired,
	settingClicked: PropTypes.func.isRequired,
	closeAlert: PropTypes.func.isRequired,
	connectDropTarget: PropTypes.func.isRequired,
	downloadExtension: PropTypes.func.isRequired,
	endBroadcast: PropTypes.func.isRequired,
	joinQueue: PropTypes.func.isRequired,
	layoutBtnClick: PropTypes.func.isRequired,
	leaveQueue: PropTypes.func.isRequired,
	markAsRead: PropTypes.func.isRequired,
	markAsViewed: PropTypes.func.isRequired,
	micBtnClick: PropTypes.func.isRequired,
	screenBtnClick: PropTypes.func.isRequired,
	selectCamera: PropTypes.func.isRequired,
	selectMic: PropTypes.func.isRequired,
	toggleJoinModal: PropTypes.func.isRequired,
	trialPublish: PropTypes.func.isRequired,
	unbindAudioListener: PropTypes.func.isRequired,
	youtubeBtnClick: PropTypes.func.isRequired,
};

export default DropTarget('bubble', dropTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	canDrop: monitor.canDrop(),
	isOver: monitor.isOver(),
	itemType: monitor.getItemType(),
}))(VideoSection);
