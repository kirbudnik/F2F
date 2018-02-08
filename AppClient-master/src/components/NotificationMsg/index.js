import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import classNames from 'classnames';
import { alertTypes } from 'constants/index'; // @todo fix path to constants
import { AlertCircle, AlertTriangle, CheckCircle, X } from 'components/Icons';
import styles from './NotificationMsg.scss';

const icon = {
	size: 30,
	strokeWidth: 1.4,
};

const NotificationMsg = ({ children, name, type, onRequestClose }) => (
	<div className={classNames(styles.wrap, styles[type])}>
		<X onClick={() => onRequestClose(name)} className={styles.close} size={28} strokeWidth={2} />
		<div>
			{type === alertTypes.INFO && <AlertCircle {...icon} className={styles.icon} />}
			{type === alertTypes.ERROR && <AlertTriangle {...icon} className={styles.icon} />}
			{type === alertTypes.SUCCESS && <CheckCircle {...icon} className={styles.icon} />}
		</div>
		<div>{children}</div>
	</div>
);

NotificationMsg.propTypes = {
	children: PropTypes.node.isRequired,
	name: PropTypes.string,
	type: PropTypes.oneOf(Object.values(alertTypes)),
	onRequestClose: PropTypes.func.isRequired,
};

export default pure(NotificationMsg);
