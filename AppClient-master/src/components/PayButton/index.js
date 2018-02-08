import { connect } from 'react-redux';
import { broadcastSelectors } from 'services/broadcast';
import { userSelectors } from 'services/user';
import { paySelectors, payActions } from 'services/pay';
import PayButton from './PayButton';

const mapStateToProps = state => ({
	broadcastId: broadcastSelectors.broadcastId(state),
	email: userSelectors.email(state),
	status: paySelectors.status(state),
});

const mapDispatchToProps = dispatch => ({
	clearPayStatus: () => dispatch(payActions.clearStatus()),
	payWithStripe: args => dispatch(payActions.payWithStripe(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PayButton);
