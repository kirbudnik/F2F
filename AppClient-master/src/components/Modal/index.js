import React from 'react';
import pure from 'recompose/pure';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { X } from 'components/Icons';
import styles from './Modal.scss';

const colors = {
	default: {
		background: '#fff',
		maxWidth: '540px',
	},
	alert: {
		background: '#ff7378',
		color: '#fff',
		padding: '3rem',
		borderRadius: '.6rem',
	},
};

const Modal = ({ children, isOpen, type, onRequestClose, ...otherProps }) => (
	<ReactModal
		className={styles[type]}
		closeTimeoutMS={300}
		isOpen={isOpen}
		style={{
			overlay: {
				backgroundColor: 'rgba(0, 0, 0, .5)',
				padding: '2rem',
			},
			content: {
				borderRadius: '1.6rem',
				position: 'static',
				top: 'auto',
				right: 'auto',
				bottom: 'auto',
				left: 'auto',
				padding: '5.4rem',
				...colors[type],
			},
		}}
		bodyOpenClassName="modal-open"
		contentLabel="modal"
		{...otherProps}
	>
		{onRequestClose && <X onClick={onRequestClose} className={styles.close} />}
		{children}
	</ReactModal>
);

Modal.propTypes = {
	children: PropTypes.node.isRequired,
	isOpen: PropTypes.bool,
	hideCloseButton: PropTypes.bool,
	type: PropTypes.oneOf(['default', 'alert']),
	onRequestClose: PropTypes.func,
};

Modal.defaultProps = {
	type: 'default',
};

export default pure(Modal);
