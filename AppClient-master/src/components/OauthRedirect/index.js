import React from 'react';
import Spinner from 'components/Spinner';


// This should be opened inside of a small popup window after redirecting from a third
// party site. Post a message to the opener to let them know our current url. The opener
// is responsible for closing this window.
class OauthRedirect extends React.Component {
	componentWillMount() {
		if (window.opener && window.opener.postMessage) {
			window.opener.postMessage({
				command: 'f2fRedirect',
				href: window.location.href,
			}, '*');
		}

		// Backup to close this window in case our parent doesn't
		this.timeout = setTimeout(() => {
			window.close();
		}, 3000);
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	render() { // eslint-disable-line class-methods-use-this
		return (
			<Spinner />
		);
	}
}

export default OauthRedirect;
