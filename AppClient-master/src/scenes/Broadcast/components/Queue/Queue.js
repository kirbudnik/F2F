import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import dingMp3 from 'audio/ding.mp3';
import { ChevronLeft, ChevronRight } from 'components/Icons';
import Bubble from './components/Bubble';
import styles from './Queue.scss';

const bubbleWidth = 75;
const skipCount = 3;

class Queue extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			skip: 0,
		};

		this.setDingRef = this.setDingRef.bind(this);
		this.setScrollRef = this.setScrollRef.bind(this);
		this.isRightArrowVisible = this.isRightArrowVisible.bind(this);
		this.leftArrowClick = this.leftArrowClick.bind(this);
		this.rightArrowClick = this.rightArrowClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (
				nextProps.isQueueSoundOn &&
				nextProps.bubbles.length > this.props.bubbles.length) {
			this.ding.volume = nextProps.volume / 100;
			this.ding.play();
		}
	}

	setDingRef(audio) {
		this.ding = audio;
	}

	setScrollRef(scroll) {
		this.scroll = scroll;
	}

	isRightArrowVisible() {
		const { bubbles } = this.props;
		const { skip } = this.state;

		if (!this.scroll) {
			return false;
		}

		return ((this.scroll.offsetWidth / bubbleWidth) + skip) - bubbles.length <= 0;
	}

	leftArrowClick() {
		const nextSkip = this.state.skip - skipCount;
		this.setState({ skip: nextSkip > 0 ? nextSkip : 0 });
	}

	rightArrowClick() {
		this.setState({ skip: this.state.skip + skipCount });
	}

	render() {
		const { publisherClientIds, bubbles, summonGuest, kickFromQueue } = this.props;
		const { skip } = this.state;
		const guestBubbles = bubbles.filter(bubble => !publisherClientIds.includes(bubble.clientId));

		return (
			<div className={styles.wrap}>
				<h3 className="show-medium">Queue</h3>
				{!guestBubbles.length &&
					<h3 className={classNames('hide-medium', styles.empty)}>Your queue is empty</h3>
				}
				{skip > 0 &&
					<button
						className={styles.arrowBtn}
						onClick={this.leftArrowClick}
					>
						<ChevronLeft size={20} />
					</button>
				}
				{!!guestBubbles.length &&
					<div className={styles.scroll} ref={this.setScrollRef}>
						<div className={styles.inner} style={{ marginLeft: -(skip * bubbleWidth) }}>
							{guestBubbles.map(bubble =>
								<Bubble
									key={bubble.clientId}
									summonGuest={summonGuest}
									kickFromQueue={kickFromQueue}
									{...bubble}
								/>)}
						</div>
					</div>
				}
				{this.isRightArrowVisible() &&
					<button
						className={styles.arrowBtn}
						onClick={this.rightArrowClick}
					>
						<ChevronRight size={20} />
					</button>
				}
				<audio src={dingMp3} ref={this.setDingRef}></audio>
			</div>
		);
	}
}

Queue.propTypes = {
	publisherClientIds: PropTypes.array,
	bubbles: PropTypes.arrayOf(PropTypes.shape({
		username: PropTypes.string.isRequired,
		clientId: PropTypes.string.isRequired,
		videoClientId: PropTypes.string.isRequired,
		imgSrc: PropTypes.string,
	})),
	summonGuest: PropTypes.func.isRequired,
	kickFromQueue: PropTypes.func.isRequired,
	volume: PropTypes.number,
	isQueueSoundOn: PropTypes.bool,
};

Queue.defaultProps = {
	bubbles: [],
	volume: 100,
};

export default Queue;
