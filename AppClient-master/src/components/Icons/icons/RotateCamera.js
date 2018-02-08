import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const RotateCamera = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="0 0 18.79 14.64"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path d="M16.42,7.2V8.52c.77.42,1.18.87,1.18,1.26,0,.91-2.17,2.11-5.82,2.49v1.19c3.71-.38,
		7-1.64,7-3.68C18.79,8.7,17.86,7.83,16.42,7.2Z"/>
		<path d="M7.14,14.62l2.18-1.37a.14.14,0,0,0,.06-.12v-.29a.13.13,0,0,0-.06-.11L7.14,
		11.36a.12.12,0,0,0-.13,0H7l-.26.15a.14.14,0,0,0-.07.12v.61c-3.45-.41-5.48-1.57-5.48-2.45,
		0-.37.37-.79,1.05-1.19V7.26C.88,7.89,0,8.73,0,9.78c0,2,3.1,3.22,6.67,3.65v.93a.14.14,0,0,0,
		.07.12l.26.14h.07Z"/>
		<path d="M3.45,9.78a1.27,1.27,0,0,0,.88.36H14.46a1.27,1.27,0,0,0,.88-.36,1.25,1.25,0,0,0,
		.39-.91V3.17A1.27,1.27,0,0,0,14.46,1.9H12.94a.56.56,0,0,1-.5-.36L12.05.36a.56.56,0,0,
		0-.5-.36H7.24a.56.56,0,0,0-.5.36L6.35,1.54a.56.56,0,0,1-.5.36H4.33A1.27,1.27,0,0,0,3.06,
		3.17v5.7A1.25,1.25,0,0,0,3.45,9.78ZM14,3A.59.59,0,0,1,14,4.2.59.59,0,1,1,14,3ZM9.39,
		2.76A3.26,3.26,0,1,1,6.13,6,3.26,3.26,0,0,1,9.39,2.76Z"/>
		<circle cx="9.39" cy="6.02" r="1.61"/>
	</svg>
);

RotateCamera.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

RotateCamera.defaultProps = {
	...screenIcon,
};

export default pure(RotateCamera);
