import React from 'react';
import { Link } from 'react-router-dom';
import Info from 'templates/Info';

const ErrorPage = () => (
	<Info>
		<h1>We&apos;re sorry - something went wrong on our end</h1>
		<p>Please <Link to="/contact" className="text-orange">contact us</Link>
		{' '}if you need help fixing this issue. We are here to help.</p>
	</Info>
);

export default ErrorPage;
