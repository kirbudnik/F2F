import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const ratio = 0.57;

const DeviceMic = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size * ratio}
		viewBox="0 0 32.24 48.87"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path d="M16.12,0A6.55,6.55,0,0,0,9.57,6.55V24a6.55,6.55,0,1,0,13.1,
		0V6.55A6.55,6.55,0,0,0,16.12,0Z"/>
		<path d="M16.12,40.14A16.14,16.14,0,0,1,0,24V19.65a.84.84,0,1,1,1.68,
		0V24a14.45,14.45,0,0,0,28.89,0V19.65a.84.84,0,1,1,1.68,0V24A16.14,16.14,0,0,1,16.12,40.14Z"/>
		<path d="M16.12,48.87a.84.84,0,0,1-.84-.84V39.3a.84.84,0,0,1,1.68,
		0V48A.84.84,0,0,1,16.12,48.87Z"/>
	</svg>
);

DeviceMic.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DeviceMic.defaultProps = {
	...screenIcon,
	size: screenIcon.size * ratio,
};

export default pure(DeviceMic);
