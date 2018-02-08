import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const ChatAlt = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="0 0 36.93 36.93"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth * 0.65}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path d="M32.83,0H4.1A4.1,4.1,0,0,0,0,4.1V36.93l8.21-8.21H32.83a4.1,4.1,0,0,0,
		4.1-4.1V4.1A4.1,4.1,0,0,0,32.83,0Zm-5.2,20.94h-17V17.38h17Zm0-8.36h-17V9h17Z"/>
	</svg>
);

ChatAlt.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ChatAlt.defaultProps = {
	...screenIcon,
};

export default pure(ChatAlt);
