import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Switch.scss';

const Switch = ({ id, isDisabled, type, value, onChange }) => {
	const handleChange = () => {
		if (!isDisabled) {
			onChange({ [id]: !value });
		}
	};

	return (
		<label className={classNames(styles.switch, isDisabled && styles.disabled, styles[type])}>
			<input type="checkbox" checked={value} onChange={handleChange} />
			<span className={styles.slider}>{value ? 'On' : 'Off'}</span>
		</label>
	);
};

Switch.propTypes = {
	id: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
	type: PropTypes.oneOf(['light']),
	value: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default Switch;
