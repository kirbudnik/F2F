import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { ChevronDown } from 'components/Icons';
import DeviceSelect from '../DeviceSelect';
import styles from './DeviceIcon.scss';

const DeviceIcon = ({
	disabledIcon,
	devices,
	enabledIcon,
	isEnabled,
	selectedDeviceId,
	onDeviceSelect,
}) => {
	const Icon = isEnabled ? enabledIcon : disabledIcon;

	return (
		<div className={styles.wrap}>
			<Icon
				fill="#fff"
				className={classNames(styles.icon, devices.length <= 1 && styles.center)}
			/>
			{devices.length > 1 &&
				<DeviceSelect
					placement="bottom"
					devices={devices}
					selectedDeviceId={selectedDeviceId}
					onDeviceSelect={onDeviceSelect}
				>
					<div className={styles.chevron}>
						<ChevronDown />
					</div>
				</DeviceSelect>
			}
		</div>
	);
};

DeviceIcon.propTypes = {
	enabledIcon: PropTypes.func.isRequired,
	disabledIcon: PropTypes.func.isRequired,
	devices: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	})).isRequired,
	isEnabled: PropTypes.bool.isRequired,
	selectedDeviceId: PropTypes.string,
	onDeviceSelect: PropTypes.func.isRequired,
};

export default onlyUpdateForKeys(['devices', 'isEnabled', 'selectedDeviceId'])(DeviceIcon);
