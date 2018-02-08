import { connect } from 'react-redux';
import { userSelectors } from 'services/user';
import { settingsActions, settingsSelectors } from 'services/settings';
import AccountDetails from './AccountDetails';

const page = 'accountDetails';

const mapStateToProps = state => ({
	username: userSelectors.username(state),
	settings: settingsSelectors.accountDetails(state),
});

const mapDispatchToProps = dispatch => ({
	onChange: (field, value) => dispatch(settingsActions.changeField({ page, field, value })),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetails);

