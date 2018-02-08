import React from 'react';
import PropTypes from 'prop-types';
import styles from './GetAvatar.scss';

// Take largest square from the video
const sourceSize = (video) => {
	const w = video.videoWidth;
	const h = video.videoHeight;
	const sx = w > h ? (w - h) / 2 : 0;
	const sy = h > w ? (h - w) / 2 : 0;

	return [sx, sy, w - (2 * sx), h - (2 * sy)];
};

const destSize = rect => [-rect.width, 0, rect.width, rect.height];


class GetAvatar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tick: 3,
		};

		this.tick = this.tick.bind(this);
		this.setCanvasRef = this.setCanvasRef.bind(this);
		this.setVideoRef = this.setVideoRef.bind(this);
		this.interval = setInterval(this.tick, 1000);
	}

	createImage() {
		const { video, canvas } = this;
		const context = canvas.getContext('2d');

		context.scale(-1, 1);
		context.drawImage(video, ...sourceSize(video), ...destSize(canvas.getBoundingClientRect()));

		this.props.onAvatarGet(canvas.toDataURL());
	}

	tick() {
		if (this.state.tick > 1) {
			this.setState({ tick: this.state.tick - 1 });
		} else {
			clearInterval(this.interval);
			this.createImage();
		}
	}

	setCanvasRef(canvas) {
		this.canvas = canvas;
	}

	setVideoRef(video) {
		this.video = video;

		if (video) {
			this.props.attachVideoElement({ video, id: this.props.trialStreamId });
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		const { tick } = this.state;

		return (
			<div className={styles.wrap} style={{ opacity: (10 - tick) / 10 }}>
				<canvas ref={this.setCanvasRef} width="35" height="35" />
				<video ref={this.setVideoRef} autoPlay />
				<span>{tick}</span>
			</div>
		);
	}
}

GetAvatar.propTypes = {
	trialStreamId: PropTypes.string.isRequired,
	attachVideoElement: PropTypes.func.isRequired,
	onAvatarGet: PropTypes.func.isRequired,
};

export default GetAvatar;
