import { connect } from 'react-redux';
import { settingsActions, settingsSelectors } from 'services/settings';
import { userSelectors } from 'services/user';
import Settings from './Settings';

const mapStateToProps = state => ({
	isAuth: userSelectors.isAuth(state),
	isLoading: settingsSelectors.isLoading(state),
	isLoadingError: settingsSelectors.isLoadingError(state),
	isSaving: settingsSelectors.isSaving(state),
	isPayApproved: userSelectors.isPayApproved(state),
	username: userSelectors.username(state),
});

const mapDispatchToProps = dispatch => ({
	clearLoadingError: () => dispatch(settingsActions.clearLoadingError()),
	openLoginModal: () => dispatch(settingsActions.openLoginModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
