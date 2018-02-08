import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { notificationActions, notificationSelectors } from 'services/notification';
import { alertTypes } from 'constants/index';
import notifications from 'constants/notifications';
import NotificationMsg from '../NotificationMsg';
import styles from './GlobalNotifications.scss';

const GlobalNotifications = ({ messages, closeMsg }) => (
	<div className={styles.wrap}>
		{messages
			.map(({ name, text, type, args }) => (
				<NotificationMsg
					key={name}
					name={name}
					type={!type ? notifications[name].type : type}
					onRequestClose={closeMsg}
				>
					{!text ? notifications[name].text(args) : text}
				</NotificationMsg>
		))}
	</div>
);

GlobalNotifications.propTypes = {
	messages: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		text: PropTypes.string,
		type: PropTypes.oneOf(Object.values(alertTypes)),
		args: PropTypes.object,
	})).isRequired,
	closeMsg: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	messages: notificationSelectors.messages(state),
});

const mapDispatchToDrops = dispatch => ({
	closeMsg: name => dispatch(notificationActions.closeMsg({ name })),
});

export default connect(mapStateToProps, mapDispatchToDrops)(GlobalNotifications);
