import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const ratio = 0.7;

const DeviceMicOff = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size * ratio}
		viewBox="0 0 47.29 47.29"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path d="M46.51,47.29a.78.78,0,0,1-.55-.23L.23,1.33A.78.78,0,0,1,
		1.33.23L47.06,46a.78.78,0,0,1-.55,1.33Z"/>
		<path d="M17.41,17.41v6.24a6.24,6.24,0,0,0,10.64,
		4.41m1.83-9.94V7A6.24,6.24,0,0,0,17.53,5.77Z"/>
		<path d="M23.64,39.07A15.31,15.31,0,0,1,8.31,23.64V19.49a.78.78,0,0,
		1,1.56,0v4.16a13.77,13.77,0,0,0,23.61,9.74.78.78,0,1,1,1.11,1.09A15.28,15.28,0,0,1,
		23.64,39.07ZM38,27h-.14a.78.78,0,0,1-.63-.91,13.88,13.88,0,0,0,.22-2.42V19.49a.78.78,
		0,0,1,1.56,0v4.16a15.41,15.41,0,0,1-.24,2.69A.78.78,0,0,1,38,27Z"/>
		<path d="M23.64,47.29a.78.78,0,0,1-.78-.78V38.2a.78.78,0,0,1,
		1.56,0v8.31A.78.78,0,0,1,23.64,47.29Z"/>
	</svg>
);

DeviceMicOff.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DeviceMicOff.defaultProps = {
	...screenIcon,
	size: screenIcon.size * ratio,
};

export default pure(DeviceMicOff);
