import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import classNames from 'classnames';
import styles from './Avatar.scss';

const Avatar = ({ src, size, title, className }) => {
	const cn = classNames(styles.avatar, styles[size], className);

	return src
		? <div className={cn} style={{ backgroundImage: `url(${src})` }} />
		: <div className={cn}>{title && title[0]}</div>;
};

Avatar.propTypes = {
	src: PropTypes.string,
	title: PropTypes.string.isRequired,
	size: PropTypes.string,
	className: PropTypes.string,
};

export default pure(Avatar);
