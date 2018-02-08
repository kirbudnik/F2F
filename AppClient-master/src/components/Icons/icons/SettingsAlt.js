import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const SettingsAlt = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="0 0 35.92 36.17"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth * 0.65}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path d="M35.11,22.28l-3.05-2.6a14.29,14.29,0,0,0,0-2.85l3.13-2.54a1.93,
		1.93,0,0,0,.58-2.22L35,10a1.92,1.92,0,0,0-1.79-1.21H33L29,9.18a14.2,14.2,0,0,
		0-1.91-2l.44-4.09a1.93,1.93,0,0,0-1.15-2l-2-.86a1.89,1.89,0,0,0-.76-.16,1.91,1.91,0,0,
		0-1.47.69L19.49,4a14.09,14.09,0,0,0-2.73,0L14.2.72A2,2,0,0,0,12,.14L10,.94a1.92,1.92,0,0,
		0-1.2,2l.34,4a14.27,14.27,0,0,0-2.05,2l-4-.43a1.92,1.92,0,0,0-2,1.16l-.85,2a1.92,1.92,0,0,0,
		.53,2.23l3,2.53a14.3,14.3,0,0,0-.05,3l-3,2.45A1.93,1.93,0,0,0,.14,24.1l.8,2a1.92,1.92,0,0,0,
		1.79,1.22h.16L6.68,27a14.14,14.14,0,0,0,2.16,2.24L8.43,33a1.93,1.93,0,0,0,1.16,2l2,.86a2,2,0,
		0,0,2.23-.54l2.44-2.92a14,14,0,0,0,3.08,0l2.39,3a1.92,1.92,0,0,0,2.22.58l2-.81a1.92,1.92,0,0,0,
		1.2-2l-.33-3.9a14.09,14.09,0,0,0,2.12-2.11l3.88.42a1.92,1.92,0,0,0,2-1.17l.85-2A1.93,1.93,0,0,0,
		35.11,22.28Zm-17,3.24a7.24,7.24,0,1,1,7.24-7.24A7.24,7.24,0,0,1,18.11,25.52Z"/>
	</svg>
);

SettingsAlt.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SettingsAlt.defaultProps = {
	...screenIcon,
};

export default pure(SettingsAlt);
