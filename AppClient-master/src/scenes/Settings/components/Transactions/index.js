import { connect } from 'react-redux';
import { settingsActions, settingsSelectors } from 'services/settings';
import Transactions from './Transactions';

const mapStateToProps = state => ({
	payments: settingsSelectors.payments(state),
});

const mapDispatchToProps = dispatch => ({
	loadData: payload => dispatch(settingsActions.loadData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
