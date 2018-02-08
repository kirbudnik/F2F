import { connect } from 'react-redux';
import { broadcastSelectors } from 'services/broadcast';
import { onboardActions, onboardSelectors } from 'services/onboard';
import { pageSelectors } from 'services/page';
import Broadcast from './Broadcast';

const mapStateToProps = state => ({
	avatarSrc: pageSelectors.avatarSrc(state),
	broadcastName: broadcastSelectors.broadcastName(state),
	hostUsername: broadcastSelectors.hostUsername(state),
	isAutoJoinOn: broadcastSelectors.isAutoJoinOn(state),
	isHost: broadcastSelectors.isHost(state),
	isLive: broadcastSelectors.isLive(state),
	isPayBtnOn: broadcastSelectors.isPayBtnOn(state),
	isUnlisted: broadcastSelectors.isUnlisted(state),
	isViewerCountOn: broadcastSelectors.isViewerCountOn(state),
	payButton: pageSelectors.payButton(state),
	tips: onboardSelectors.tips(state),
	viewerCount: broadcastSelectors.viewerCount(state),
});

const mapDispatchToProps = dispatch => ({
	closeShareTip: () => dispatch(onboardActions.closeTip({ tipId: 'shareLink' })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Broadcast);
