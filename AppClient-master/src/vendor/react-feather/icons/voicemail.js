import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

const Voicemail = (props) => {
	const { color, size, strokeWidth, ...otherProps } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			{...otherProps}
		>
			<circle
				cx="5.5"
				cy="11.5"
				r="4.5"
				fill="none"
				stroke={color}
				strokeMiterlimit="10"
				strokeWidth={strokeWidth}
			/>
			<circle
				cx="18.5"
				cy="11.5"
				r="4.5"
				fill="none"
				stroke={color}
				strokeMiterlimit="10"
				strokeWidth={strokeWidth}
			/>
			<line
				x1="5.5"
				y1="16"
				x2="18.5"
				y2="16"
				fill="none"
				stroke={color}
				strokeMiterlimit="10"
				strokeWidth={strokeWidth}
			/>
		</svg>
	);
};

Voicemail.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Voicemail.defaultProps = {
	color: 'currentColor',
	size: '24',
	strokeWidth: '1',
};

export default pure(Voicemail);
