import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Info.scss';

const Info = ({
	children,
	className,
	coverSrc,
}) => (
	<div
		className={classNames(styles.wrap, className)}
		style={coverSrc && { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.55)), url(${coverSrc})` }}
	>
		<div className={styles.inner}>
			{children}
		</div>
	</div>
);

Info.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	coverSrc: PropTypes.string,
};


export default Info;
