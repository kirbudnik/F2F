import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import classNames from 'classnames';
import styles from './FlatButton.scss';

const FlatButton = ({ children, className, color, disabled, onClick }) => (
	<a
		className={classNames(
			styles.flatButton,
			styles[color],
			disabled && 'disabled',
			className,
		)}
		disabled={disabled}
		onClick={onClick}
	>
		{children}
	</a>
);

FlatButton.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	color: PropTypes.oneOf(['orange', 'primary']),
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
};

export default pure(FlatButton);
