import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import styles from './MicVolume.scss';

const MicVolume = ({ volume }) => (
	<div className={styles.wrap}>
		<span style={{ height: `${volume * 100}%` }} />
	</div>
);

MicVolume.propTypes = {
	volume: PropTypes.number.isRequired,
};

MicVolume.defaultProps = {
	volume: 0.4,
};

export default pure(MicVolume);
