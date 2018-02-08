import { connect } from 'react-redux';
import { settingsActions, settingsSelectors } from 'services/settings';
import { userSelectors } from 'services/user';
import Payments from './Payments';

const page = 'pay';

const mapStateToProps = state => ({
	settings: settingsSelectors.pay(state),
	username: userSelectors.username(state),
	channels: userSelectors.channels(state),
});

const mapDispatchToProps = dispatch => ({
	loadData: payload => dispatch(settingsActions.loadData(payload)),
	linkStripe: () => dispatch(settingsActions.linkStripe()),
	unlinkStripe: () => dispatch(settingsActions.unlinkStripe()),
	onChange: (field, value, options) => dispatch(settingsActions.changeField({
		page,
		field,
		value,
		options,
	})),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
