import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const Restream = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="0 0 17.76 20.14"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path d="M16.72,14a3.56,3.56,0,0,0-4.91-.12L7,11.12A3.56,3.56,0,0,0,7,9.26l5-2.91a3.56,
		3.56,0,1,0-1.35-2.69L5,6.94a3.56,3.56,0,1,0,0,6.5l5.62,3.28A3.56,3.56,0,1,0,16.72,14Z"/>
	</svg>
);

Restream.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Restream.defaultProps = {
	...screenIcon,
	fill: 'none',
};

export default pure(Restream);
