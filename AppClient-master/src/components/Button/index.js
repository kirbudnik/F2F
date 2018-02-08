import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Button.scss';

const Button = ({ children, className, href, to, type, onClick }) => {
	const Component = to ? Link : 'a';

	return (
		<Component
			className={classNames(
				type === 'green' && styles.f2fBtnGreen,
				type === 'orange' && styles.f2fBtnOrange,
				styles.f2fBtn,
				className,
			)}
			href={href}
			to={to}
			onClick={onClick}
		>
			{children}
		</Component>
	);
};

Button.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	href: PropTypes.string,
	to: PropTypes.string,
	type: PropTypes.oneOf(['green', 'orange']),
	onClick: PropTypes.func,
};

Button.defaultProps = {
	type: 'green',
};

export default pure(Button);
