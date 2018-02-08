import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { DragSource } from 'react-dnd';
import { Plus, XCircle } from 'components/Icons';
import Avatar from 'components/Avatar';
import styles from './Bubble.scss';

const dragSource = {
	beginDrag(props) {
		return { ...props };
	},
};

const xIcon = {
	size: 24,
	color: '#fff',
	fill: '#dadddd',
	strokeWidth: 1.5,
};

const plusIcon = {
	color: '#000',
	strokeWidth: 0.8,
};

class Bubble extends React.Component {
	constructor(props) {
		super(props);

		this.kickFromQueue = this.kickFromQueue.bind(this);
		this.summonGuest = this.summonGuest.bind(this);
	}

	kickFromQueue() {
		const { kickFromQueue, clientId, videoClientId } = this.props;

		kickFromQueue({ clientId, videoClientId });
	}

	summonGuest() {
		const { summonGuest, clientId, videoClientId } = this.props;

		summonGuest({ clientId, videoClientId });
	}

	render() {
		const {
			// connectDragSource,
			isLoading,
			username,
			imgSrc,
		} = this.props;

		return (
			<div className={styles.wrap}>
				{!isLoading && <XCircle onClick={this.kickFromQueue} {...xIcon} />}
				<Tooltip
					destroyTooltipOnHide
					placement="top"
					trigger={['hover']}
					overlayClassName="show-medium"
					overlay={
						<span>
							{isLoading ?
								<span>Adding</span> :
								<span>Click to add</span>
							}
							{' '}
							<a
								href={`/${username}`}
								target="_blank" rel="noopener noreferrer"
								className={styles.username}
							>
								{username}
							</a> to the broadcast
						</span>
					}
				>
					<div className={styles.avatarWrap} onClick={this.summonGuest}>
						{!isLoading && <Plus className={styles.plus} {...plusIcon} />}
						{isLoading && <div className={styles.loader}><span /><span /></div>}
						<Avatar
							className={styles.avatar}
							src={imgSrc}
							title={username}
							size="tiny"
						/>
					</div>
				</Tooltip>
				<p>{username}</p>
			</div>
		);
	}
}

Bubble.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	clientId: PropTypes.string.isRequired,
	videoClientId: PropTypes.string.isRequired,
	imgSrc: PropTypes.string,
	isLoading: PropTypes.bool,
	summonGuest: PropTypes.func.isRequired,
	kickFromQueue: PropTypes.func.isRequired,
};

export default DragSource('bubble', dragSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))(Bubble);
