import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import Device from './components/Device';
import styles from './DeviceSelect.scss';

class DeviceSelect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
		};

		this.clickOutside = this.clickOutside.bind(this);
		this.closeTooltip = this.closeTooltip.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.selectDevice = this.selectDevice.bind(this);
		this.setTooltipRef = this.setTooltipRef.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mouseup', this.clickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.clickOutside);
		clearTimeout(this.timer);
	}

	clickOutside(event) {
		if (this.state.isOpen && this.tooltipRef && !this.tooltipRef.contains(event.target)) {
			this.timer = setTimeout(this.closeTooltip, 10);
		}
	}

	closeTooltip() {
		if (this.state.isOpen) {
			this.setState({ isOpen: false });
		}
	}

	handleClick(event) {
		event.stopPropagation();
		this.setState({ isOpen: !this.state.isOpen });
	}

	selectDevice(...args) {
		this.props.onDeviceSelect(...args);
		this.timer = setTimeout(this.closeTooltip, 300);
	}

	setTooltipRef(c) {
		this.tooltipRef = c;
	}

	render() {
		const {
			placement,
			devices,
			selectedDeviceId,
			children,
			getTooltipContainer,
		} = this.props;

		const { isOpen } = this.state;

		return (
			<Tooltip
				placement={placement}
				overlayClassName="rc-tooltip-select"
				onClick={this.handleClick}
				visible={isOpen}
				overlay={
					<ul ref={this.setTooltipRef} className={styles.tooltip}>
						{devices.map(device => (
							<Device
								key={device.id}
								device={device}
								isActive={device.id === selectedDeviceId}
								onClick={this.selectDevice}
							/>
						))}
					</ul>
				}
				getTooltipContainer={getTooltipContainer}
			>
				{children}
			</Tooltip>
		);
	}
}

DeviceSelect.propTypes = {
	placement: PropTypes.oneOf(['bottom', 'top']),
	devices: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	})),
	selectedDeviceId: PropTypes.string,
	onDeviceSelect: PropTypes.func.isRequired,
	children: PropTypes.node,
	getTooltipContainer: PropTypes.func,
};

DeviceSelect.defaultProps = {
	placement: 'bottom',
};

export default DeviceSelect;
