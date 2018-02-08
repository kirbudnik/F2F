import React from 'react';
import PropTypes from 'prop-types';
import MicVolume from '../MicVolume';
import styles from './DevicesTest.scss';

function withinBounds(val, min, max) {
	if (val < min) {
		return min;
	}
	if (val > max) {
		return max;
	}
	return val;
}

class DevicesTest extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			micVolume: 0,
		};

		this.micVolumeChange = this.micVolumeChange.bind(this);
		this.changeMic = this.changeMic.bind(this);
		this.changeCamera = this.changeCamera.bind(this);
		this.testComplete = this.testComplete.bind(this);
		this.setVideoRef = this.setVideoRef.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.trialStreamId && !this.props.trialStreamId) {
			const id = nextProps.trialStreamId;

			if (this.video) {
				this.props.attachVideoElement({ id, video: this.video });
			}
			this.props.bindAudioListener({ id, callback: this.micVolumeChange });
		}
	}

	micVolumeChange({ current, average }) {
		this.setState({ micVolume: withinBounds((current / average) / 5, 0, 1) });
	}

	changeMic(evt) {
		this.props.selectMic(evt.target.value);
	}

	changeCamera(evt) {
		this.props.selectCamera(evt.target.value);
	}

	testComplete() {
		if (this.props.trialStreamId) {
			this.props.testComplete();
		}
	}

	setVideoRef(video) {
		this.video = video;
	}

	componentWillUnmount() {
		const id = this.props.trialStreamId;

		if (id) {
			this.props.unbindAudioListener(id);
		}
	}

	render() {
		const {
			isMicOnly,
			mics,
			selectedMicId,
			cameras,
			selectedCameraId,
		} = this.props;

		const { micVolume } = this.state;

		return (
			<div className={styles.wrap}>
				<div className={styles.tests}>
					{!isMicOnly &&
						<div className={styles.camera}>
							<video ref={this.setVideoRef} autoPlay />
						</div>
					}
					<MicVolume volume={micVolume} />
				</div>
				<label>Mic
					<select value={selectedMicId || ''} onChange={this.changeMic}>
						{mics.map(({ id, label }) => (
							<option key={id} value={id}>{label}</option>
						))}
					</select>
				</label>
				{!isMicOnly &&
					<label>Camera
						<select value={selectedCameraId || ''} onChange={this.changeCamera}>
							{cameras.map(({ id, label }) => (
								<option key={id} value={id}>{label}</option>
							))}
						</select>
					</label>
				}
				<button className="modal-submit" onClick={this.testComplete}>
					Send join request
				</button>
			</div>
		);
	}
}

DevicesTest.propTypes = {
	isMicOnly: PropTypes.bool,
	trialStreamId: PropTypes.string,
	mics: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	})),
	cameras: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	})),
	selectedMicId: PropTypes.string,
	selectedCameraId: PropTypes.string,

	// Actions
	selectMic: PropTypes.func.isRequired,
	selectCamera: PropTypes.func,
	attachVideoElement: PropTypes.func.isRequired,
	bindAudioListener: PropTypes.func.isRequired,
	unbindAudioListener: PropTypes.func.isRequired,
	testComplete: PropTypes.func.isRequired,
};

DevicesTest.defaultProps = {
	cameras: [
		{
			id: 'default',
			label: 'Default',
		},
	],
	mics: [
		{
			id: 'default',
			label: 'Default',
		},
	],
};

export default DevicesTest;
