import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Video, Mic } from 'components/Icons';
import { icon } from 'constants/broadcast';
import DevicesTest from '../DevicesTest';
import GetAvatar from '../GetAvatar';
import styles from './JoinProcess.scss';

const steps = {
	CAMERA: 'camera',
	MIC: 'mic',
	SMILE: 'smile',
};

class JoinProcess extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			step: false,
		};

		this.joinWithCamera = this.joinWithCamera.bind(this);
		this.joinWithMic = this.joinWithMic.bind(this);
		this.smileCamera = this.smileCamera.bind(this);
		this.joinQueue = this.joinQueue.bind(this);
	}

	joinWithCamera() {
		this.props.trialPublish({ hasAudio: true, hasVideo: true });
		this.setState({ step: steps.CAMERA });
	}

	joinWithMic() {
		this.props.trialPublish({ hasAudio: true, hasVideo: false });
		this.setState({ step: steps.MIC });
	}

	smileCamera() {
		this.setState({ step: steps.SMILE });
	}

	joinQueue(imgSrc) {
		this.props.joinQueue({
			hasAudio: true,
			hasVideo: imgSrc !== undefined,
			imgSrc,
		});
	}

	render() {
		const {
			trialStreamId,
			mics,
			cameras,
			selectedMicId,
			selectedCameraId,
			selectMic,
			selectCamera,
			attachVideoElement,
			bindAudioListener,
			unbindAudioListener,
		} = this.props;

		const { step } = this.state;

		return (
			<div className={styles.wrap}>
				{!step &&
					<div>
						<button
							onClick={this.joinWithCamera}
							className={classNames(styles.button, styles.video)}
						>
							<Video {...icon} color="#fff" />
							<span>Join with camera + mic</span>
						</button>
						<button
							onClick={this.joinWithMic}
							className={classNames(styles.button, styles.mic)}
						>
							<Mic {...icon} color="#fff" />
							<span>Join with mic</span>
						</button>
						<p>
							We&apos;ll test your devices then send a request to the host.<br />
							They may choose to add you in at any moment.<br />
							You may cancel at any time.
						</p>
					</div>
				}
				{step === steps.CAMERA &&
					<DevicesTest
						trialStreamId={trialStreamId}
						mics={mics}
						cameras={cameras}
						selectedMicId={selectedMicId}
						selectedCameraId={selectedCameraId}
						selectMic={selectMic}
						selectCamera={selectCamera}
						attachVideoElement={attachVideoElement}
						bindAudioListener={bindAudioListener}
						unbindAudioListener={unbindAudioListener}
						testComplete={this.smileCamera}
					/>
				}
				{step === steps.MIC &&
					<DevicesTest
						isMicOnly
						trialStreamId={trialStreamId}
						mics={mics}
						selectedMicId={selectedMicId}
						selectMic={selectMic}
						attachVideoElement={attachVideoElement}
						bindAudioListener={bindAudioListener}
						unbindAudioListener={unbindAudioListener}
						testComplete={this.joinQueue}
					/>
				}
				{step === steps.SMILE &&
					<div>
						<h2><span>😊</span> Smile!</h2>
						<h3>Sending your picture to the host</h3>
						<GetAvatar
							trialStreamId={trialStreamId}
							attachVideoElement={attachVideoElement}
							onAvatarGet={this.joinQueue}
						/>
					</div>
				}
			</div>
		);
	}
}

JoinProcess.propTypes = {
	trialStreamId: PropTypes.string,
	mics: PropTypes.array.isRequired,
	cameras: PropTypes.array.isRequired,
	selectedMicId: PropTypes.string,
	selectedCameraId: PropTypes.string,

	// Actions
	selectMic: PropTypes.func.isRequired,
	selectCamera: PropTypes.func,
	trialPublish: PropTypes.func.isRequired,
	attachVideoElement: PropTypes.func.isRequired,
	bindAudioListener: PropTypes.func.isRequired,
	unbindAudioListener: PropTypes.func.isRequired,
	joinQueue: PropTypes.func.isRequired,
};

export default JoinProcess;
