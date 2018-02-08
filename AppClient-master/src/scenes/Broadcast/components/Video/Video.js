import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Subject } from 'rxjs/Subject';
import Avatar from 'components/Avatar';
import { Headphones, Maximize2, Minimize2 /* , PlayCircle */ } from 'components/Icons';
import { userTypes } from 'constants/broadcast';
import DeviceSelect from '../DeviceSelect';
import GoLive from '../GoLive';
import VideoVolume from '../VideoVolume';
import Stream from './components/Stream';
import styles from './Video.scss';

const extraIconSize = 28;

export const onHover = new Subject();

class Video extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isHover: false,
		};

		this.setHover = this.setHover.bind(this);
		this.setVideoRef = this.setVideoRef.bind(this);
		this.getFullscreenProps = this.getFullscreenProps.bind(this);
		this.getTooltipContainer = this.getTooltipContainer.bind(this);
		this.requestFullscreen = this.requestFullscreen.bind(this);
		this.cancelFullscreen = this.cancelFullscreen.bind(this);
		this.resizeEvent = this.resizeEvent.bind(this);
		this.resizeVideo = this.resizeVideo.bind(this);
		this.mouseEnter = this.mouseEnter.bind(this);
		this.mouseLeave = this.mouseLeave.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.resizeEvent);
		this.fullscreen = this.getFullscreenProps();

		if (this.fullscreen) {
			document[this.fullscreen.onfullscreenchange] = () => this.forceUpdate();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.asideWidth !== this.props.asideWidth) {
			this.resizeVideo(nextProps.asideWidth);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeEvent);
		clearTimeout(this.resizeTimeout);

		if (this.fullscreen) {
			document[this.fullscreen.onfullscreenchange] = null;
		}
	}

	setHover(isHover) {
		if (window.innerWidth < 768) {
			this.setState({ isHover });
			onHover.next(isHover);
		}
	}

	setVideoRef(c) {
		this.videoRef = c;
		this.resizeVideo();
	}

	getFullscreenProps() {
		if (!this.videoRef) {
			return null;
		}

		if (this.videoRef.requestFullscreen && !!document.exitFullscreen) {
			return {
				element: 'fullscreenElement',
				enabled: 'fullscreenEnabled',
				exit: 'exitFullscreen',
				request: 'requestFullscreen',
				onfullscreenchange: 'onfullscreenchange',
			};
		}

		if (this.videoRef.webkitRequestFullscreen && !!document.webkitExitFullscreen) {
			return {
				element: 'webkitFullscreenElement',
				enabled: 'webkitFullscreenEnabled',
				exit: 'webkitExitFullscreen',
				request: 'webkitRequestFullscreen',
				onfullscreenchange: 'onwebkitfullscreenchange',
			};
		}

		if (this.videoRef.mozRequestFullScreen && !!document.mozCancelFullScreen) {
			return {
				element: 'mozFullScreenElement',
				enabled: 'mozFullScreenEnabled',
				exit: 'mozCancelFullScreen',
				request: 'mozRequestFullScreen',
				onfullscreenchange: 'onmozfullscreenchange',
			};
		}

		if (this.videoRef.msRequestFullscreen && !!document.msExitFullscreen) {
			return {
				element: 'msFullscreenElement',
				enabled: 'msFullscreenEnabled',
				exit: 'msExitFullscreen',
				request: 'msRequestFullscreen',
				onfullscreenchange: 'onmsfullscreenchange',
			};
		}

		return null;
	}

	getTooltipContainer() {
		return this.videoRef;
	}

	isFullscreen() {
		return !!(this.fullscreen && document[this.fullscreen.element]);
	}

	isFullscreenEnabled() {
		if (!this.fullscreen) {
			return false;
		}

		const { enabled } = this.fullscreen;
		return document[enabled];
	}

	requestFullscreen() {
		const { request } = this.fullscreen;
		this.videoRef[request]();
	}

	cancelFullscreen() {
		document[this.fullscreen.exit]();
	}

	resizeEvent() {
		if (!this.resizeTimeout) {
			this.resizeTimeout = setTimeout(() => {
				this.resizeTimeout = null;
				this.resizeVideo();
			}, 128);
		}
	}

	resizeVideo(asideWidth = this.props.asideWidth) {
		if (this.videoRef) {
			const { innerWidth } = window;
			const { offsetHeight } = this.videoRef;
			const { ratio } = this.props;
			let width = innerWidth >= 768 && !this.isFullscreen()
				? (innerWidth - asideWidth)
				: innerWidth;

			// Landscape video size
			if (!this.isFullscreen()
				&& window.matchMedia('(orientation: landscape)').matches
				&& innerWidth < 768
			) {
				width = asideWidth > 118 ? innerWidth * 0.65 : innerWidth;
			}

			if (width / offsetHeight > ratio) {
				this.setState({
					height: offsetHeight,
					width: offsetHeight * ratio,
				});
			} else {
				this.setState({
					height: width / ratio,
					width,
				});
			}
		}
	}

	mouseEnter() {
		this.setHover(true);
	}

	mouseLeave() {
		this.setHover(false);
	}

	render() {
		const {
			attachVideoElement,
			avatarSrc,
			bindAudioListener,
			broadcastName,
			goLiveClick,
			hasYoutubeKey,
			hostUsername,
			isDeviceAccessGranted,
			isLive,
			isSpeakerSelectionSupported,
			isUnlisted,
			isYoutubeLive,
			selectSpeaker,
			selectedSpeakerId,
			setVolume,
			speakers,
			streams,
			unsummonGuest,
			userType,
			volume,
			youtubeBtnClick,
		} = this.props;

		const { height, width, isHover } = this.state;

		const isHost = userType === userTypes.HOST;
		const title = isUnlisted ? hostUsername : broadcastName;

		const isFullscreen = this.isFullscreen();
		const isFullscreenEnabled = this.isFullscreenEnabled();

		return (
			<div
				ref={this.setVideoRef}
				className={styles.wrap}
				onMouseOver={this.mouseEnter}
				onMouseOut={this.mouseLeave}
			>
				<div className={styles.videoContainer}>
					<div style={{ width, height }} className={styles.inner}>
						{streams.map(stream => (
							<Stream
								key={stream.id}
								stream={stream}
								isHost={isHost}
								volume={volume}
								speakerId={selectedSpeakerId}
								attachVideoElement={attachVideoElement}
								bindAudioListener={bindAudioListener}
								unsummonGuest={unsummonGuest}
							/>
						))}
						{/*
						<PlayCircle
							size={200}
							strokeWidth={1}
							color="#fff" className={styles.playVideo}
						/>
						*/}
					</div>
					{isHost &&
						<GoLive
							isLive={isLive}
							isUnlisted={isUnlisted}
							goLiveClick={goLiveClick}
							isYoutubeLive={isYoutubeLive}
							hasYoutubeKey={hasYoutubeKey}
							youtubeBtnClick={youtubeBtnClick}
						/>
					}
				</div>
				<div className={classNames(styles.extra, isHover && styles.hover)}>
					<div className="show-medium">
						<VideoVolume onChange={setVolume} />
						{(isDeviceAccessGranted && isSpeakerSelectionSupported && speakers.length > 0) &&
							<DeviceSelect
								placement="top"
								devices={speakers}
								selectedDeviceId={selectedSpeakerId}
								onDeviceSelect={selectSpeaker}
								getTooltipContainer={this.getTooltipContainer}
							>
								<Headphones size={extraIconSize} className={styles.speaker}/>
							</DeviceSelect>
						}
					</div>
					<div className="hide-medium">
						<div className={classNames(styles.info, 'hide-medium')}>
							<Avatar
								title={title}
								src={avatarSrc}
								className={styles.avatar}
								size="tiny"
							/>
							<div className={styles.headers}>
								{!isUnlisted && hostUsername}
								<span>{title}</span>
							</div>
						</div>
					</div>
					<div>
						{isFullscreenEnabled && !isFullscreen &&
							<Maximize2
								size={extraIconSize}
								className={styles.fullScreen}
								onClick={this.requestFullscreen}
							/>
						}
						{isFullscreen &&
							<Minimize2
								size={extraIconSize}
								className={styles.fullScreen}
								onClick={this.cancelFullscreen}
							/>
						}
					</div>
				</div>
			</div>
		);
	}
}

Video.propTypes = {
	asideWidth: PropTypes.number,
	attachVideoElement: PropTypes.func.isRequired,
	avatarSrc: PropTypes.string,
	bindAudioListener: PropTypes.func.isRequired,
	broadcastName: PropTypes.string.isRequired,
	goLiveClick: PropTypes.func.isRequired,
	hasYoutubeKey: PropTypes.bool.isRequired,
	hostUsername: PropTypes.string.isRequired,
	isDeviceAccessGranted: PropTypes.bool,
	isLive: PropTypes.bool.isRequired,
	isSpeakerSelectionSupported: PropTypes.bool,
	isUnlisted: PropTypes.bool.isRequired,
	isYoutubeLive: PropTypes.bool.isRequired,
	ratio: PropTypes.number.isRequired,
	selectSpeaker: PropTypes.func.isRequired,
	selectedSpeakerId: PropTypes.string,
	setVolume: PropTypes.func.isRequired,
	speakers: PropTypes.array.isRequired,
	streams: PropTypes.array.isRequired,
	unsummonGuest: PropTypes.func.isRequired,
	userType: PropTypes.string.isRequired,
	volume: PropTypes.number.isRequired,
	youtubeBtnClick: PropTypes.func.isRequired,
};

Video.defaultProps = {
	asideWidth: 438,
	ratio: 16 / 9,
};

export default Video;
