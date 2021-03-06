import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

const Instagram = (props) => {
	const { color, size, strokeWidth, ...otherProps } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			{...otherProps}
		>
			<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
			<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
			<line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
		</svg>
	);
};

Instagram.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Instagram.defaultProps = {
	color: 'currentColor',
	size: '24',
	strokeWidth: '1',
};

export default pure(Instagram);
