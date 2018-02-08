import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const FacebookLive = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="0 0 35 35"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path d="M28.3,5.1H6.7c-0.9,0-1.5,0.7-1.5,1.5v21.7c0,0.9,0.7,1.5,1.5,1.5h21
			.7c0.9,0,1.5-0.7,1.5-1.5V6.7
			C29.9,5.8,29.2,5.1,28.3,5.1z M22.1,12.9h-1.5c-1.3,0-1.5,0-1.5,3.1h3.1V19H19v6.2H16V19h-3
			.1V16H16c0-2.4,0-6.2,4.6-6.2h1.5V12.9z"
		/>
	</svg>
);

FacebookLive.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

FacebookLive.defaultProps = {
	...screenIcon,
};

export default pure(FacebookLive);
