import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { videoRoles } from 'constants/broadcast';
import { MicOff, VideoOff, XCircle } from 'components/Icons';
import styles from './Stream.scss';

const mediaIcon = {
	color: '#fff',
	strokeWidth: 1.3,
	size: 32,
};
const xIcon = {
	color: '#000',
	strokeWidth: 1.8,
	size: 24,
	fill: '#ccc',
};

function withinBounds(val, min, max) {
	if (val < min) {
		return min;
	}
	if (val > max) {
		return max;
	}
	return val;
}

// const isConnecting = status => status === 'connecting' || status === 'reconnecting';

class Stream extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			audioLevel: 0,
		};

		this.unsummonGuest = this.unsummonGuest.bind(this);
		this.onAudioLevel = this.onAudioLevel.bind(this);
		this.setVideoRef = this.setVideoRef.bind(this);
	}

	componentDidMount() {
		this.video.volume = this.props.volume / 100;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.volume !== this.props.volume) {
			this.video.volume = nextProps.volume / 100;
		}
		if (nextProps.speakerId !== this.props.speakerId && this.video) {
			this.props.attachVideoElement({
				id: nextProps.stream.id,
				speakerId: nextProps.speakerId,
				video: this.video,
			});
		}
	}

	unsummonGuest() {
		const { unsummonGuest, stream } = this.props;
		const { clientId, videoClientId } = stream;

		unsummonGuest({ clientId, videoClientId });
	}

	onAudioLevel({ current, average }) {
		const audioLevel = withinBounds((current / average) / 5, 0, 1);

		if (!this.props.stream.hasVideo) {
			this.setState({ audioLevel });
		}
	}

	setVideoRef(video) {
		this.video = video;

		if (video) {
			const { stream, speakerId } = this.props;
			const { id } = stream;

			this.props.attachVideoElement({ id, speakerId, video });
			this.props.bindAudioListener({ id, callback: this.onAudioLevel });

			// Manually call .play() on the elements. That way, if this throws
			// due to browser autoplay restrictions we will log the uncaught
			// error to rollbar
			video.play();
		}
	}

	render() {
		const { stream, isHost } = this.props;
		const {
			isPub,
			isScreen,
			coords,
			username,
			hasAudio,
			hasVideo,
			role,
			status,
		} = stream;

		const isModStream = role === videoRoles.MODERATOR;

		const style = {
			top: `${coords.y}%`,
			left: `${coords.x}%`,
			width: `${coords.w}%`,
			height: `${coords.h}%`,
			zIndex: `${coords.z}`,
			opacity: coords.z === 0 ? 0 : 1,
			transform: coords.transform || '',
			transformOrigin: coords.transformOrigin || '',
		};

		return (
			<div
				className={classNames(
					styles.wrap,
					{
						[styles.noBackground]: isScreen,
						[styles.mirror]: isPub && !isScreen,
						[styles.borderTop]: coords.h !== 100,
						[styles.borderSides]: coords.w !== 100,
					},
				)}
				style={style}
			>
				{hasVideo &&
					<img src="images/svg/spinner-orange.svg" className={styles.spinner} />
				}

				<video
					className={status !== 'connected' && styles.connecting}
					ref={this.setVideoRef}
					autoPlay
				/>
				{!hasVideo && !isScreen &&
					<div className={styles.cover}/>
				}
				{!hasVideo && hasAudio && !isScreen &&
					<span
						className={styles.audioLevel}
						style={{ transform: `scale(${this.state.audioLevel})` }}
					/>
				}
				<div className={styles.noMedia}>
					{!hasAudio && !isScreen &&
						<span>
							<MicOff {...mediaIcon} />
						</span>
					}
					{!hasVideo && !isScreen &&
						<span>
							<VideoOff {...mediaIcon} />
						</span>
					}
				</div>
				<a
					className={styles.username}
					href={`/${username}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{username}
				</a>
				{isHost && !isModStream &&
					<XCircle className={styles.x} onClick={this.unsummonGuest} {...xIcon} />
				}
			</div>
		);
	}
}

Stream.propTypes = {
	attachVideoElement: PropTypes.func.isRequired,
	bindAudioListener: PropTypes.func.isRequired,
	unsummonGuest: PropTypes.func,
	isHost: PropTypes.bool.isRequired,
	volume: PropTypes.number.isRequired,
	speakerId: PropTypes.string,
	stream: PropTypes.shape({
		id: PropTypes.string.isRequired,
		isPub: PropTypes.bool.isRequired,
		isScreen: PropTypes.bool.isRequired,
		hasAudio: PropTypes.bool.isRequired,
		hasVideo: PropTypes.bool.isRequired,
		clientId: PropTypes.string.isRequired,
		videoClientId: PropTypes.string.isRequired,
		role: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		status: PropTypes.string.isRequired,
		coords: PropTypes.shape({
			x: PropTypes.number.isRequired,
			y: PropTypes.number.isRequired,
			z: PropTypes.number.isRequired,
			w: PropTypes.number.isRequired,
			h: PropTypes.number.isRequired,
		}).isRequired,
	}).isRequired,
};

export default Stream;
