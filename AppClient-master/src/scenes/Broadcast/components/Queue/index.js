import { connect } from 'react-redux';
import { broadcastSelectors } from 'services/broadcast';
import { queueSelectors, queueActions } from 'services/queue';
import Queue from './Queue';

const mapStateToProps = state => ({
	bubbles: queueSelectors.bubbles(state),
	publisherClientIds: broadcastSelectors.publisherClientIds(state),
	volume: broadcastSelectors.volume(state),
	isQueueSoundOn: broadcastSelectors.isQueueSoundOn(state),
});

const mapDispatchToProps = dispatch => ({
	summonGuest: payload => dispatch(queueActions.summonGuest(payload)),
	kickFromQueue: payload => dispatch(queueActions.kickFromQueue(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Queue);
