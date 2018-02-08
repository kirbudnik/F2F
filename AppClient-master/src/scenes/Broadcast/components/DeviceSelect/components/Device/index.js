import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import classNames from 'classnames';
import styles from './Device.scss';

const Device = ({ device, isActive, onClick }) => {
	const handleClick = () => {
		onClick(device.id);
	};

	return (
		<li>
			<a className={classNames(styles.device, isActive && styles.active)} onClick={handleClick}>
				{device.label}
			</a>
		</li>
	);
};

Device.propTypes = {
	device: PropTypes.shape({
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	}),
	isActive: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default pure(Device);
