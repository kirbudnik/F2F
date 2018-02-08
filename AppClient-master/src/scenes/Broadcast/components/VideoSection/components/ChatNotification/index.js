import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { chatSelectors } from 'services/chat';
import styles from './ChatNotification.scss';

const ChatNotification = ({ unreadComments }) => (
	<span className={classNames(styles.dot, !!unreadComments && styles.active)} />
);

ChatNotification.propTypes = {
	unreadComments: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
	unreadComments: chatSelectors.unreadComments(state),
});

export default connect(mapStateToProps)(ChatNotification);
