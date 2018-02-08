import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { queueSelectors } from 'services/queue';
import styles from '../ChatNotification/ChatNotification.scss';

const QueueNotification = ({ bubbles, lastViewedBubbles }) => {
	const active =
		bubbles.length && !bubbles.every(({ clientId }) => lastViewedBubbles.indexOf(clientId) !== -1);

	return (
		<span style={{ right: '0.6rem' }} className={classNames(styles.dot, active && styles.active)} />
	);
};

QueueNotification.propTypes = {
	bubbles: PropTypes.array.isRequired,
	lastViewedBubbles: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
	bubbles: queueSelectors.bubbles(state),
	lastViewedBubbles: queueSelectors.lastViewedBubbles(state),
});

export default connect(mapStateToProps)(QueueNotification);
