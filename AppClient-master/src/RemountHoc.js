import React from 'react';
import PropTypes from 'prop-types';


export default (Component) => {
	// Using location.key causes a remount when clicking on a Link tag to the same url
	// we are already on. This is undesired. Concatenate pathname + search instead.
	const Remount = props => (
		<Component key={props.location.pathname + props.location.search} {...props} />
	);

	Remount.propTypes = {
		location: PropTypes.shape(),
	};

	return Remount;
};
