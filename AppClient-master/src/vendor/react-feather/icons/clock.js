import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

const Clock = (props) => {
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
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 15 15" />
		</svg>
	);
};

Clock.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Clock.defaultProps = {
	color: 'currentColor',
	size: '24',
	strokeWidth: '1',
};

export default pure(Clock);
