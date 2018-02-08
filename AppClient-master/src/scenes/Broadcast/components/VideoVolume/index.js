import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import classNames from 'classnames';
import Slider from 'rc-slider';
import { Volume, Volume1, Volume2, VolumeX } from 'components/Icons';
import styles from './VideoVolume.scss';


const getIcon = (volume) => {
	if (volume === 0) {
		return VolumeX;
	} else if (volume < 10) {
		return Volume;
	} else if (volume < 50) {
		return Volume1;
	}
	return Volume2;
};


class VideoVolume extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			volume: 100,
		};

		this.preMuteVolume = 100;

		this.toggleMute = this.toggleMute.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	toggleMute() {
		if (this.state.volume > 0) {
			this.preMuteVolume = this.state.volume;
			this.setState({ volume: 0 });
		} else {
			this.setState({ volume: this.preMuteVolume });
		}
	}

	onChange(volume) {
		this.setState({ volume });
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.volume !== prevState.volume) {
			this.props.onChange({ volume: this.state.volume });
		}
	}

	render() {
		const { volume } = this.state;
		const Icon = getIcon(volume);

		return (
			<div className={styles.wrap}>
				<Icon
					color="#fff"
					size={34}
					className={classNames(styles.icon)}
					onClick={this.toggleMute}
				/>
				<Slider
					className={classNames(styles.bar, 'show-medium')}
					max={100}
					min={0}
					step={1}
					value={volume}
					onChange={this.onChange}
					handle={({ offset }) =>
						<span className={styles.circle} style={{ left: offset }}/>
					}
				/>
			</div>
		);
	}
}

VideoVolume.propTypes = {
	onChange: PropTypes.func.isRequired,
};

export default pure(VideoVolume);
