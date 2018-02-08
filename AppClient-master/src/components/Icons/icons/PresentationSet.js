import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const PresentationSet = ({ color, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="-4 0 136.29 56"
		fill="none"
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<rect fill="#d9d9d9" width="124" height="56"/>
	</svg>
);

PresentationSet.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

PresentationSet.defaultProps = {
	...screenIcon,
};

export default pure(PresentationSet);
