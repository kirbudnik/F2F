import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const YoutubeLive = ({ color, fill, size, strokeWidth, ...otherProps }) => (
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
		<path
			d="M25.8,8.2H9.2c-2.2,0-4.1,2-4.1,4.3v9.9c0,2.4,1.8,4.3,4.1,4.3h16.7c2.2,0,4-1.9,4-4.3v-9.9
			C29.9,10.2,28.1,8.2,25.8,8.2z M21.9,17.9L15.1,22c-0.4,0.2-0.7,0.1-0.7-0.4v-8.3c0-0.5,0.3-0.6,
			0.7-0.4l6.8,4.1
			C22.2,17.3,22.2,17.7,21.9,17.9z"
		/>
	</svg>
);

YoutubeLive.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

YoutubeLive.defaultProps = {
	...screenIcon,
};

export default pure(YoutubeLive);
