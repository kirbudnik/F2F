import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { userActions } from 'services/user';
import GlobalNotifications from 'components/GlobalNotifications';
import Main from 'templates/Main';

class Startup extends React.Component {
	constructor(props) {
		super(props);

		props.auth();
	}

	render() {
		return (
			<Main>
				{this.props.children}
				<GlobalNotifications />
			</Main>
		);
	}
}

Startup.propTypes = {
	children: PropTypes.element.isRequired,
	auth: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
	auth: () => dispatch(userActions.auth()),
});


export default withRouter(connect(null, mapDispatchToProps)(Startup));
