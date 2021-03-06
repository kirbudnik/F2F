import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

const BarChart = (props) => {
	const { color, size, strokeWidth, ...otherProps } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			{...otherProps}
		>
			<rect
				x="18"
				y="3"
				width="4"
				height="18"
				fill="none"
				stroke={color}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth}
			/>
			<rect
				x="10"
				y="8"
				width="4"
				height="13"
				fill="none"
				stroke={color}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth}
			/>
			<rect
				x="2"
				y="13"
				width="4"
				height="8"
				fill="none"
				stroke={color}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth}
			/>
		</svg>
	);
};

BarChart.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

BarChart.defaultProps = {
	color: 'currentColor',
	size: '24',
	strokeWidth: '1',
};

export default pure(BarChart);
