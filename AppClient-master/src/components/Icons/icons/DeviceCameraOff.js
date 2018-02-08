import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const ratio = 0.75;

const DeviceCameraOff = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size * ratio}
		viewBox="4 0 54.3 49.37"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<polygon points="40.39 21.05 54.3 30.99 54.3 11.12 40.39 21.05"/>
		<path d="M36.42,7.14H19.61L40.39,27.92V11.12A4,4,0,0,0,36.42,7.14Z"/>
		<path d="M48.75,47.65,36.06,35,10.84,9.74,1.72.62,1.33.23a.78.78,0,0,
		0-1.1,1.1L10.58,11.69V31a4,4,0,0,0,4,4h19.3L48,49.14a.78.78,0,0,0,1.1-1.1Z"/>
	</svg>
);

DeviceCameraOff.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DeviceCameraOff.defaultProps = {
	...screenIcon,
	size: screenIcon.size * ratio,
};

export default pure(DeviceCameraOff);
