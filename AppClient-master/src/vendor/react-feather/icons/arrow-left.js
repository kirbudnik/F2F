import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

const ArrowLeft = (props) => {
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
			<line x1="20" y1="12" x2="4" y2="12" />
			<polyline points="10 18 4 12 10 6" />
		</svg>
	);
};

ArrowLeft.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ArrowLeft.defaultProps = {
	color: 'currentColor',
	size: '24',
	strokeWidth: '1',
};

export default pure(ArrowLeft);
