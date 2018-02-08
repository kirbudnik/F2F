/* eslint class-methods-use-this: off */
import React from 'react';


export default class Logout extends React.Component {
	componentWillMount() {
		// Server is configured to log the user out and redirect home
		window.location.reload();
	}

	render() {
		return false;
	}
}
