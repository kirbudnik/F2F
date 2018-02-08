import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const NewsSet = ({ color, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="0 -3 49.73 22.64"
		fill="none"
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path fill="#d9d9d9" d="M12.9,4.35A4.35,4.35,0,1,1,8.54,0,4.37,4.37,0,0,1,12.9,4.35Zm4.19,
		14.37a12.8,12.8,0,0,0-3.37-8A2.35,2.35,0,0,0,12,10H5.08a2.55,2.55,0,0,0-1.7.69,12.63,12.63,
		0,0,0-3.37,8,.86.86,0,0,0,.85.92H16.24A.86.86,0,0,0,17.09,18.72Z"/>
		<rect fill="#d9d9d9" x="24.03" y="1.67" width="24.69" height="16.3"/>
	</svg>
);

NewsSet.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

NewsSet.defaultProps = {
	...screenIcon,
};

export default pure(NewsSet);
