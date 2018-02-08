import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { screenIcon } from 'constants/broadcast';

const MailAlt = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="2 2 16 16"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth * 0.65}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path
			d="M13.56,5.94c.43-.22.47-.15.1.15L6.2,12.21a1.4,
			1.4,0,0,0-.52,1.07v3.11c0,.46.24.58.6.28l3-2.63,2.2,
			2.06A.26.26,0,0,0,12,16L16.81,3.43c.08-.22,0-.33-.26-.24L3.37,8a.24.24,
			0,0,0-.1.44L4.92,9.94a.65.65,0,0,0,.7.09Z"/>
	</svg>
);

MailAlt.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

MailAlt.defaultProps = {
	...screenIcon,
};

export default pure(MailAlt);
