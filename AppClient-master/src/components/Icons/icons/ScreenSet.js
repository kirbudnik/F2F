import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const ratio = 1.15;

const ScreenSet = ({ color, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size * ratio}
		viewBox="-5 0 56.67 23.4"
		fill="none"
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path fill="#b4b4b4" d="M44.56,15.7a2.19,2.19,0,1,1-2.19-2.19A2.2,2.2,0,0,1,44.56,15.7Zm2.11,
		7.24a6.45,6.45,0,0,0-1.7-4,1.18,1.18,0,0,0-.86-.35h-3.5a1.29,1.29,0,0,0-.86.35,6.36,6.36,0,0,
		0-1.7,4,.43.43,0,0,0,.43.46h7.75A.43.43,0,0,0,46.67,22.94Z"/>
		<path fill="#d9d9d9" d="M44.56,2.19A2.19,2.19,0,1,1,42.36,0,2.2,2.2,0,0,1,44.56,2.19Zm2.11,
		7.24a6.45,6.45,0,0,0-1.7-4A1.18,1.18,0,0,0,44.11,5h-3.5a1.29,1.29,0,0,0-.86.35,6.36,6.36,0,0,
		0-1.7,4,.43.43,0,0,0,.43.46h7.75A.43.43,0,0,0,46.67,9.44Z"/>
		<rect fill="#d9d9d9" y="0.81" width="31.77" height="22.59"/>
	</svg>
);

ScreenSet.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ScreenSet.defaultProps = {
	...screenIcon,
	size: screenIcon.size * ratio,
};

export default pure(ScreenSet);
