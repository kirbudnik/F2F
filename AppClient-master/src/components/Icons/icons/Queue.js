import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const Queue = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="0 0 26.89 21.33"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path d="M14,4.73A4.73,4.73,0,1,1,9.28,0,4.75,4.75,0,0,1,14,4.73Zm4.55,15.6a13.9,13.9,0,
		0,0-3.66-8.71A2.55,2.55,0,0,0,13,10.88H5.51a2.77,2.77,0,0,0-1.85.75A13.71,13.71,0,0,0,0,
		20.33a.93.93,0,0,0,.92,1H17.63A.93.93,0,0,0,18.56,20.33Z"/>
		<polygon points="26.89,4.25,22.88,4.25,22.88,0.25,21.38,0.25,21.38,4.25,17.37,4.25,17.37,
		5.75,21.38,5.75,21.38,9.77,22.88,9.77,22.88,5.75,26.89,5.75,26.89,4.25"/>
	</svg>
);

Queue.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Queue.defaultProps = {
	...screenIcon,
};

export default pure(Queue);
