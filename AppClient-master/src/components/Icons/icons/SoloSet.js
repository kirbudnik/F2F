import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const SoloSet = ({ color, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="-33 -4 113.08 59.94"
		fill="none"
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
    <path fill="#d9d9d9" d="M33,11.15A11.15,11.15,0,1,1,21.89,0,11.2,11.2,0,0,1,33,11.15ZM43.78,
    48c-.67-8.39-3.86-15.76-8.64-20.54a6,6,0,0,0-4.36-1.76H13a6.53,6.53,0,0,0-4.36,1.76C3.86,
    32.2.59,39.58,0,48a2.21,2.21,0,0,0,2.18,2.35H41.6A2.21,2.21,0,0,0,43.78,48Z"/>
	</svg>
);

SoloSet.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SoloSet.defaultProps = {
	...screenIcon,
};

export default pure(SoloSet);
