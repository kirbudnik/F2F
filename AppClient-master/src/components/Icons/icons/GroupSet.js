import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const GroupSet = ({ color, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="-12 -2 113.08 59.94"
		fill="none"
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path fill="#d9d9d9" d="M16.19,5.47A5.47,5.47,0,1,1,10.73,0,5.49,5.49,0,0,1,16.19,5.47Zm5.26,
		18a16.07,16.07,0,0,0-4.23-10.07,3,3,0,0,0-2.14-.86H6.37a3.2,3.2,0,0,0-2.14.86A15.85,15.85,0,0,
		0,0,23.51a1.08,1.08,0,0,0,1.07,1.15H20.39A1.08,1.08,0,0,0,21.46,23.51Z"/>
		<path fill="#b4b4b4" d="M16.19,37.91a5.47,5.47,0,1,1-5.47-5.47A5.49,5.49,0,0,1,16.19,
		37.91Zm5.26,18a16.07,16.07,0,0,0-4.23-10.07A3,3,0,0,0,15.09,45H6.37a3.2,3.2,0,0,
		0-2.14.86A15.85,15.85,0,0,0,0,56,1.08,1.08,0,0,0,1.07,57.1H20.39A1.08,1.08,0,0,0,21.46,56Z"/>
		<path fill="#b4b4b4" d="M51.06,5.47A5.47,5.47,0,1,1,45.59,0,5.49,5.49,0,0,1,51.06,5.47Zm5.26,
		18a16.07,16.07,0,0,0-4.23-10.07,3,3,0,0,0-2.14-.86H41.24a3.2,3.2,0,0,0-2.14.86,15.85,15.85,0,0,
		0-4.23,10.07,1.08,1.08,0,0,0,1.07,1.15H55.25A1.08,1.08,0,0,0,56.32,23.51Z"/>
		<path fill="#b4b4b4" d="M51.06,37.91a5.47,5.47,0,1,1-5.47-5.47A5.49,5.49,0,0,1,51.06,
		37.91Zm5.26,18a16.07,16.07,0,0,0-4.23-10.07A3,3,0,0,0,49.95,45H41.24a3.2,3.2,0,0,
		0-2.14.86A15.85,15.85,0,0,0,34.87,56a1.08,1.08,0,0,0,1.07,1.15H55.25A1.08,1.08,0,
		0,0,56.32,56Z"/>
		<path fill="#b4b4b4" d="M85.92,5.47A5.47,5.47,0,1,1,80.46,0,5.49,5.49,0,0,1,85.92,5.47Zm5.26,
		18A16.07,16.07,0,0,0,87,13.44a3,3,0,0,0-2.14-.86H76.1a3.2,3.2,0,0,0-2.14.86,15.85,15.85,0,
		0,0-4.23,10.07,1.08,1.08,0,0,0,1.07,1.15H90.11A1.08,1.08,0,0,0,91.18,23.51Z"/>
		<path fill="#b4b4b4" d="M85.92,37.91a5.47,5.47,0,1,1-5.47-5.47A5.49,5.49,0,0,1,85.92,
		37.91Zm5.26,18A16.07,16.07,0,0,0,87,45.88,3,3,0,0,0,84.81,45H76.1a3.2,3.2,0,0,0-2.14.86A15.85,
		15.85,0,0,0,69.73,56,1.08,1.08,0,0,0,70.8,57.1H90.11A1.08,1.08,0,0,0,91.18,56Z"/>
	</svg>
);

GroupSet.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

GroupSet.defaultProps = {
	...screenIcon,
};

export default pure(GroupSet);