import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Tooltip from 'rc-tooltip';
import { X } from 'components/Icons';
import styles from './InfoTip.scss';


const InfoTip = ({ children, overlay, visible, onRequestClose }) => (
	<Tooltip placement="bottom" overlayClassName="rc-tooltip-green" visible={visible} overlay={
		<div className={styles.wrap}>
			{onRequestClose &&
				<X
					onClick={() => onRequestClose(name)}
					className={styles.close}
					size={28}
					strokeWidth={2}
				/>
			}
			<div>{overlay}</div>
		</div>
	}>
		{children}
	</Tooltip>
);

InfoTip.propTypes = {
	children: PropTypes.node.isRequired,
	overlay: PropTypes.node.isRequired,
	visible: PropTypes.bool.isRequired,
	onRequestClose: PropTypes.func,
};

export default pure(InfoTip);
