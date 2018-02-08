import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const InstagramAlt = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="2 2 16 16"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth * 0.65}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path
			d="M13.34,3.32H6.66A3.34,3.34,0,0,0,3.32,6.66v6.68a3.34,
			3.34,0,0,0,3.34,3.34h6.68a3.34,3.34,0,0,0,3.34-3.34V6.66A3.34,
			3.34,0,0,0,13.34,3.32Zm-2.92,9.3a2.67,2.67,0,1,1,2.25-3A2.67,2.67,
			0,0,1,10.42,12.62Zm3.73-5.82a.68.68,0,0,1-.47.2h-.13l-.12,
			0-.12-.06-.1-.09a.41.41,0,0,1-.08-.1.38.38,0,0,1-.06-.11.41.41,0,0,1,
			0-.13.84.84,0,0,1,0-.13.69.69,0,0,1,.19-.47.7.7,0,0,1,.95,0,.67.67,0,0,1,0,.94Z"
		/>
	</svg>
);

InstagramAlt.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

InstagramAlt.defaultProps = {
	...screenIcon,
};

export default pure(InstagramAlt);
