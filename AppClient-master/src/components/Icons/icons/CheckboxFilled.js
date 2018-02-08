import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const CheckboxFilled = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="-4 -4 43 43"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path
			d="M29.9,2H5.1c-2,0-3.5,1.6-3.5,3.5v24.8c0,2,1.6,3.5,3.5,3.5h24.8c2,0,3.5-1.6,3.5-3.5V5.5
			C33.5,3.6,31.9,2,29.9,2z M29.5,13.3L17.1,25.6c-0.4,0.4-0.9,
			0.6-1.5,0.6s-1.1-0.2-1.5-0.6l-5.8-5.8c-0.8-0.8-0.8-2.2,0-3
			c0.8-0.8,2.2-0.8,3,0l4.3,4.3l10.9-10.9c0.8-0.8,2.2-0.8,3,0C30.3,11.1,30.3,12.4,29.5,13.3z"/>
	</svg>
);

CheckboxFilled.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CheckboxFilled.defaultProps = {
	...screenIcon,
};

export default pure(CheckboxFilled);
