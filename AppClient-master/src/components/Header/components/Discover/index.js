import { connect } from 'react-redux';
import { discoverActions, discoverSelectors } from 'services/discover';
import Discover from './Discover';

const mapStateToProps = state => ({
	channels: discoverSelectors.channels(state),
	isLoading: discoverSelectors.isLoading(state),
	isLoadingError: discoverSelectors.isLoadingError(state),
});

const mapDispatchToProps = dispatch => ({
	loadAttempt: () => dispatch(discoverActions.loadAttempt()),
	channelClick: () => dispatch(discoverActions.channelClick()),
});


export default connect(mapStateToProps, mapDispatchToProps)(Discover);
