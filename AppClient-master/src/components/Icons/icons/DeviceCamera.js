import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const ratio = 0.7;

const DeviceCamera = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size * ratio}
		viewBox="0 -8 49.36 39.41"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<polygon points="49.36 4.49 33.66 15.71 49.36 26.93 49.36 4.49"/>
		<rect width="33.66" height="31.41" rx="4.49" ry="4.49"/>
	</svg>
);

DeviceCamera.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DeviceCamera.defaultProps = {
	...screenIcon,
	size: screenIcon.size * ratio,
};

export default pure(DeviceCamera);
