import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import classNames from 'classnames';
import styles from './AsideButton.scss';

class AsideButton extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		if (this.props.onClick) {
			this.props.onClick(this.props.callbackArgument);
		}
	}

	render() {
		const { className, icon, text, isActive } = this.props;

		// We have to use <div /> not <button /> because in Firefox hover not working inside button
		return (
			<div
				className={classNames(styles.btn, isActive && styles.active, className)}
				onClick={this.handleClick}
			>
				<div>{icon}</div>
				{text && <p>{text}</p>}
			</div>
		);
	}
}

AsideButton.propTypes = {
	callbackArgument: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	className: PropTypes.string,
	text: PropTypes.string,
	icon: PropTypes.element.isRequired,
	isActive: PropTypes.bool,
	onClick: PropTypes.func,
};

export default onlyUpdateForKeys(['className', 'text', 'isActive', 'icon'])(AsideButton);
