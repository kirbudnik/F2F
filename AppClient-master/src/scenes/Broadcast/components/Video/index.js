import { connect } from 'react-redux';
import { broadcastActions, broadcastSelectors } from 'services/broadcast';
import { queueActions } from 'services/queue';
import { publishActions, publishSelectors } from 'services/publish';
import { restreamActions, restreamSelectors } from 'services/restream';
import { videoActions } from 'services/video';
import { pageSelectors } from 'services/page';
import Video from './Video';

const mapStateToProps = state => ({
	avatarSrc: pageSelectors.avatarSrc(state),
	broadcastName: broadcastSelectors.broadcastName(state),
	hasYoutubeKey: restreamSelectors.hasYoutubeKey(state),
	hostUsername: broadcastSelectors.hostUsername(state),
	isDeviceAccessGranted: publishSelectors.isDeviceAccessGranted(state),
	isLive: broadcastSelectors.isLive(state),
	isSpeakerSelectionSupported: broadcastSelectors.isSpeakerSelectionSupported(state),
	isUnlisted: broadcastSelectors.isUnlisted(state),
	isYoutubeLive: restreamSelectors.isYoutubeLive(state),
	selectedSpeakerId: publishSelectors.selectedSpeakerId(state),
	speakers: publishSelectors.speakers(state),
	streams: broadcastSelectors.streams(state),
	userType: broadcastSelectors.userType(state),
	volume: broadcastSelectors.volume(state),
});

const mapDispatchToProps = dispatch => ({
	attachVideoElement: payload => dispatch(videoActions.attachVideoElement(payload)),
	bindAudioListener: payload => dispatch(videoActions.bindAudioListener(payload)),
	goLiveClick: () => dispatch(broadcastActions.goLiveClick()),
	selectSpeaker: id => dispatch(publishActions.selectSpeaker({ id })),
	setVolume: payload => dispatch(broadcastActions.setVolume(payload)),
	unsummonGuest: payload => dispatch(queueActions.unsummonGuest(payload)),
	youtubeBtnClick: () => dispatch(restreamActions.youtubeBtnClick()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{ withRef: true },
)(Video);
