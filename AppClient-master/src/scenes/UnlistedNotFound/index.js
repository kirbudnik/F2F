import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Info from 'templates/Info';

const UnlistedNotFound = ({ username }) => (
	<Info>
		<h1>Hello</h1>
		<p>{username} isn&apos;t here yet. You can either:
		<br/>- Wait here until they begin. When they do, the page will update automatically.
		<br/>- Double check the URL to ensure you&apos;re in the right place.
		</p>
		<Link to={`/${username}`} className="text-orange">Visit their profile</Link>
	</Info>
);

UnlistedNotFound.propTypes = {
	username: PropTypes.string.isRequired,
};

export default UnlistedNotFound;
