import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

const Link2 = (props) => {
	const { color, size, strokeWidth, ...otherProps } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			{...otherProps}
		>
			<path
				d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"
				fill="none"
				stroke={color}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth}
			/>
			<line
				x1="8"
				y1="12"
				x2="16"
				y2="12"
				fill="none"
				stroke={color}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth}
			/>
		</svg>
	);
};

Link2.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Link2.defaultProps = {
	color: 'currentColor',
	size: '24',
	strokeWidth: '1',
};

export default pure(Link2);
