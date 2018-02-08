import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

const Stripe = ({ color, fill, size, strokeWidth, ...otherProps }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		viewBox="0 0 49.84 20.74"
		fill={fill}
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...otherProps}
	>
		<path fill="#fff" d="M49.84,10.71c0-3.54-1.71-6.34-5-6.34s-5.29,
		2.8-5.29,6.32c0,4.17,2.36,6.28,5.73,6.28a7.75,7.75,0,0,0,3.83-.9V13.29a7.3,
		7.3,0,0,1-3.4.76c-1.35,0-2.53-.48-2.69-2.1h6.77C49.81,11.77,49.84,11,49.84,10.71ZM43,
		9.41c0-1.56,1-2.21,1.82-2.21s1.75.65,1.75,2.21Z"/>
		<path fill="#fff" d="M34.21,4.38A3.87,3.87,0,0,0,31.5,5.46l-.18-.85h-3V20.74L31.73,
		20V16.1a3.88,3.88,0,0,0,2.45.87c2.47,0,4.74-2,4.74-6.38C38.92,6.56,36.64,4.38,34.21,
		4.38Zm-.83,9.54a2.07,2.07,0,0,1-1.63-.66l0-5.14a2.09,2.09,0,0,1,1.65-.68c1.26,0,2.14,1.42,2.14,
		3.23S34.66,13.92,33.38,13.92Z"/>
		<polygon fill="#fff" points="23.51 3.55 26.98 2.82 26.98 0 23.51 0.74 23.51 3.55"/>
		<rect fill="#fff" x="23.51" y="4.61" width="3.47" height="12.12"/>
		<path fill="#fff" d="M19.79,5.63l-.22-1h-3V16.73H20V8.51a2.46,2.46,0,0,1,2.64-.72V4.61A2.36
		,2.36,0,0,0,19.79,5.63Z"/>
		<path fill="#fff" d="M12.86,1.6l-3.38.72V13.41A3.48,3.48,0,0,0,13.06,17a5.34,5.34,0,0,
		0,2.43-.46V13.7c-.44.18-2.62.81-2.62-1.23V7.55h2.63V4.61H12.86Z"/>
		<path fill="#fff" d="M3.5,8.12c0-.54.45-.75,1.17-.75a7.75,7.75,0,0,1,3.44.89V5a9.13,9.13,0,
		0,0-3.44-.63C1.87,4.38,0,5.84,0,8.29c0,3.83,5.26,3.21,5.26,4.86,0,.64-.56.85-1.33.85a8.71,
		8.71,0,0,1-3.78-1.1v3.3A9.59,9.59,0,0,0,3.93,17c2.87,0,4.86-1.42,4.86-3.91C8.78,
		8.94,3.5,9.68,3.5,8.12Z"/>
	</svg>
);

Stripe.propTypes = {
	color: PropTypes.string,
	fill: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Stripe.defaultProps = {
	fill: '#fff',
	strokeWidth: 0,
	width: 48,
};

export default pure(Stripe);
