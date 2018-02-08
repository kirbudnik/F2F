import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar';
import PayButton from 'components/PayButton';
import { ChevronLeft, Eye } from 'components/Icons';
// import InfoTip from 'components/InfoTip';
import VideoSection from './components/VideoSection';
import VideoShare from './components/VideoShare';
import { onHover } from './components/Video/Video';
import styles from './Broadcast.scss';

class Broadcast extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isHover: false,
		};

		this.setHover = this.setHover.bind(this);
		this.enableHover = this.enableHover.bind(this);
	}

	componentWillMount() {
		document.body.classList.add('mobile-hide-header', 'hide-footer');
		this.subscription = onHover.subscribe(this.setHover);
	}

	componentWillUnmount() {
		document.body.classList.remove('mobile-hide-header', 'hide-footer');
		this.subscription.unsubscribe();
	}

	setHover(isHover) {
		if (window.innerWidth < 768) {
			this.setState({ isHover });
		}
	}

	enableHover() {
		this.setHover(true);
	}

	render() {
		const {
			avatarSrc,
			broadcastName,
			hostUsername,
			isAutoJoinOn,
			isHost,
			isLive,
			isPayBtnOn,
			isUnlisted,
			isViewerCountOn,
			payButton,
			viewerCount,
			// tips,
			// closeShareTip,
			videoSectionComponent,
		} = this.props;

		const title = isUnlisted ? hostUsername : broadcastName;

		const { isHover } = this.state;

		return (
			<div className={classNames(styles.wrap, isHover && styles.hover)}>
				<div className={styles.vh100}>
					{videoSectionComponent || <VideoSection />}
					<div
						className={styles.subHeader}
						onMouseEnter={this.enableHover}
					>
						<Link to="/" className={classNames(styles.goBack, 'hide-medium')}>
							<ChevronLeft strokeWidth={2} size={28} />
						</Link>
						<div className={classNames(styles.info, 'show-medium')}>
							<Avatar
								title={title}
								src={avatarSrc}
								className={styles.avatar}
								size="small"
							/>
							<div className={styles.headers}>
								<h1>{title}</h1>
								{!isUnlisted && <h3>{hostUsername}</h3>}
							</div>
						</div>
						{ /* <InfoTip visible={tips.shareLink} onRequestClose={closeShareTip} overlay={
							<p>Share the link to invite others</p>
							}> */ }
							<VideoShare
								isHost={isHost}
								isLive={isLive}
								isUnlisted={isUnlisted}
								isAutoJoinOn={isAutoJoinOn}
							/>
						{ /* </InfoTip> */ }
						{(isHost || isViewerCountOn) &&
							<div className={styles.viewerCount}>
								<Eye strokeWidth={1} size={24} />
								{viewerCount || ''}
								<span className="show-medium">
									{viewerCount === 1 ? 'Viewer' : 'Viewers'}
								</span>
							</div>
						}
						{payButton && payButton.isStripeConnected && isPayBtnOn &&
							<PayButton {...payButton} username={hostUsername} userAvatarSrc={avatarSrc} />}
					</div>
				</div>
			</div>
		);
	}
}

Broadcast.propTypes = {
	avatarSrc: PropTypes.string,
	broadcastName: PropTypes.string,
	closeShareTip: PropTypes.func.isRequired,
	hostUsername: PropTypes.string,
	isAutoJoinOn: PropTypes.bool,
	isHost: PropTypes.bool,
	isLive: PropTypes.bool,
	isPayBtnOn: PropTypes.bool,
	isUnlisted: PropTypes.bool,
	isViewerCountOn: PropTypes.bool,
	payButton: PropTypes.shape(PayButton.propTypes),
	tips: PropTypes.object.isRequired,
	viewerCount: PropTypes.number,

	videoSectionComponent: PropTypes.node, // We use it to render VideoSection in tests
};

export default DragDropContext(HTML5Backend)(Broadcast);
