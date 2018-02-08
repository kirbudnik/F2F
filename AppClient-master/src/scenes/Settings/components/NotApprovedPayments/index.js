import { connect } from 'react-redux';
import { settingsActions } from 'services/settings';
import { userSelectors } from 'services/user';
import NotApprovedPayments from './NotApprovedPayments';


const mapStateToProps = state => ({
	username: userSelectors.username(state),
	email: userSelectors.email(state),
	hasApplied: userSelectors.hasAppliedForPay(state),
});

const mapDispatchToProps = dispatch => ({
	onApplied: () => dispatch(settingsActions.appliedForPay()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotApprovedPayments);
