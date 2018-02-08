import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const ShareAlt = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="0 0 11.1 9.05"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path d="M6.57,6.16V8.62l4.1-4.1L6.57.43v2C.3,2.52.43,8.62.43,8.62A6.66,6.66,0,0,1,6.57,6.16Z"/>
	</svg>
);

ShareAlt.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ShareAlt.defaultProps = {
	...screenIcon,
};

export default pure(ShareAlt);
