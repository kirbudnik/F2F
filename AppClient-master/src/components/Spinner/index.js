import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Spinner.scss';

const Spinner = ({ className, inline }) => (
	<span className={classNames(styles.spinner, inline && styles.inline, className)} />
);

Spinner.propTypes = {
	className: PropTypes.string,
	inline: PropTypes.bool,
};

export default Spinner;
