import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

const ArrowUp = (props) => {
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
			<line x1="12" y1="20" x2="12" y2="4" />
			<polyline points="6 10 12 4 18 10" />
		</svg>
	);
};

ArrowUp.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ArrowUp.defaultProps = {
	color: 'currentColor',
	size: '24',
	strokeWidth: '1',
};

export default pure(ArrowUp);
