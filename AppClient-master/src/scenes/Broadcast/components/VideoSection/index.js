import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { broadcastSelectors, broadcastActions } from 'services/broadcast';
import { chatActions } from 'services/chat';
import { publishSelectors, publishActions } from 'services/publish';
import { restreamActions, restreamSelectors } from 'services/restream';
import { queueActions, queueSelectors } from 'services/queue';
import { userSelectors } from 'services/user';
import { videoActions } from 'services/video';
import VideoSection from './VideoSection';

const mapStateToProps = state => ({
	username: userSelectors.username(state),
	userType: broadcastSelectors.userType(state),
	videoLayout: broadcastSelectors.videoLayout(state),
	isJoinModalOpen: queueSelectors.isJoinModalOpen(state),
	hasYoutubeKey: restreamSelectors.hasYoutubeKey(state),
	isYoutubeLive: restreamSelectors.isYoutubeLive(state),
	localBubbleSrc: queueSelectors.localBubbleSrc(state),
	trialStreamId: publishSelectors.trialStreamId(state),
	mics: publishSelectors.mics(state),
	cameras: publishSelectors.cameras(state),
	selectedMicId: publishSelectors.selectedMicId(state),
	selectedCameraId: publishSelectors.selectedCameraId(state),
	isLive: broadcastSelectors.isLive(state),
	isMicBtnOn: publishSelectors.isMicBtnOn(state),
	isCameraBtnOn: publishSelectors.isCameraBtnOn(state),
	isScreenBtnOn: publishSelectors.isScreenBtnOn(state),
	alerts: broadcastSelectors.alerts(state),
	viewerCount: broadcastSelectors.viewerCount(state),
	isUnlisted: broadcastSelectors.isUnlisted(state),
	settings: broadcastSelectors.settings(state),
});

const mapDispatchToProps = dispatch => ({
	endBroadcast: () => dispatch(broadcastActions.endBroadcast()),
	toggleJoinModal: payload => dispatch(queueActions.toggleJoinModal(payload)),
	selectMic: id => dispatch(publishActions.selectMic({ id })),
	selectCamera: id => dispatch(publishActions.selectCamera({ id })),
	markAsRead: () => dispatch(chatActions.markAsRead()),
	markAsViewed: () => dispatch(queueActions.markAsViewed()),
	micBtnClick: () => dispatch(publishActions.micBtnClick()),
	cameraBtnClick: () => dispatch(publishActions.cameraBtnClick()),
	screenBtnClick: () => dispatch(publishActions.screenBtnClick()),
	layoutBtnClick: layout => dispatch(broadcastActions.layoutBtnClick({ layout })),
	trialPublish: payload => dispatch(publishActions.trialPublish(payload)),
	joinQueue: payload => dispatch(queueActions.join(payload)),
	leaveQueue: () => dispatch(queueActions.leave()),
	attachVideoElement: payload => dispatch(videoActions.attachVideoElement(payload)),
	bindAudioListener: payload => dispatch(videoActions.bindAudioListener(payload)),
	unbindAudioListener: id => dispatch(videoActions.unbindAudioListener({ id })),
	closeAlert: payload => dispatch(broadcastActions.closeAlert(payload)),
	downloadExtension: () => dispatch(broadcastActions.downloadExtension()),
	settingClicked: args => dispatch(broadcastActions.settingClicked(args)),
	youtubeBtnClick: () => dispatch(restreamActions.youtubeBtnClick()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VideoSection));
