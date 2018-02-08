import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { icon } from 'constants/broadcast';

const ShareScreen = ({ color, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 70.09 52.55"
		fill="none"
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<rect fill="#b4b4b4" y="47.16" width="70.09" height="5.38"/>
		<path fill="#b4b4b4" d="M57.78,0H12.52A6.15,6.15,0,0,0,6.37,6.15V34.62a6.15,
		6.15,0,0,0,6.15,6.15H57.78a6.15,6.15,0,0,0,6.15-6.15V6.15A6.15,6.15,0,0,0,57.78,
		0ZM38.36,26.75V21.47c-13.88.38-17.1,10.85-17.1,10.85.08-16.61,13.37-19.11,
		17.1-19.48V8.46L49,17.6Z"/>
	</svg>
);

ShareScreen.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ShareScreen.defaultProps = {
	...icon,
};

export default pure(ShareScreen);
