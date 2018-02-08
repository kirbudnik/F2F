import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const HostSet = ({ color, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="0 0 113.08 59.94"
		fill="none"
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path fill="#d9d9d9" d="M30.27,22.93A10.22,10.22,0,1,1,20.06,12.71,10.26,10.26,0,0,1,
		30.27,22.93Zm9.83,33.73c-.61-7.68-3.53-14.44-7.91-18.82a5.51,5.51,0,0,0-4-1.61H11.91a6,
		6,0,0,0-4,1.61C3.54,42.21.54,49,0,56.66a2,2,0,0,0,2,2.15H38.11A2,2,0,0,0,40.11,56.66Z"/>
		<path fill="#b4b4b4" d="M75.29,5.74A5.74,5.74,0,1,1,69.56,0,5.76,5.76,0,0,1,75.29,
		5.74Zm5.52,18.94a16.87,16.87,0,0,0-4.44-10.57,3.09,3.09,0,0,0-2.24-.91H65a3.36,3.36,
		0,0,0-2.24.91A16.64,16.64,0,0,0,58.3,24.67a1.13,1.13,0,0,0,1.12,1.21H79.69A1.13,1.13,
		0,0,0,80.82,24.67Z"/>
		<path fill="#b4b4b4" d="M107.55,5.74A5.74,5.74,0,1,1,101.81,0,5.76,5.76,0,0,1,
		107.55,5.74Zm5.52,18.94a16.87,16.87,0,0,0-4.44-10.57,3.09,3.09,0,0,
		0-2.24-.91H97.24a3.36,3.36,0,0,0-2.24.91,16.64,16.64,0,0,0-4.44,10.57,1.13,1.13,0,0,
		0,1.12,1.21H112A1.13,1.13,0,0,0,113.07,24.67Z"/>
		<path fill="#b4b4b4" d="M75.29,39.79a5.74,5.74,0,1,1-5.74-5.74A5.76,5.76,0,0,1,75.29,
		39.79Zm5.52,18.94a16.87,16.87,0,0,0-4.44-10.57,3.09,3.09,0,0,0-2.24-.91H65a3.36,3.36,
		0,0,0-2.24.91A16.64,16.64,0,0,0,58.3,58.73a1.13,1.13,0,0,0,1.12,1.21H79.69A1.13,1.13,0,
		0,0,80.82,58.73Z"/>
		<path fill="#b4b4b4" d="M107.55,39.79a5.74,5.74,0,1,1-5.74-5.74A5.76,5.76,0,0,1,107.55,
		39.79Zm5.52,18.94a16.87,16.87,0,0,0-4.44-10.57,3.09,3.09,0,0,0-2.24-.91H97.24a3.36,3.36,
		0,0,0-2.24.91,16.64,16.64,0,0,0-4.44,10.57,1.13,1.13,0,0,0,1.12,1.21H112A1.13,1.13,0,0,0,
		113.07,58.73Z"/>
	</svg>
);

HostSet.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

HostSet.defaultProps = {
	...screenIcon,
};

export default pure(HostSet);
