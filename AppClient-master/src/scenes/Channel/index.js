import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { broadcastActions } from 'services/broadcast';
import { pageSelectors } from 'services/page';
import { userActions, userSelectors } from 'services/user';
import Avatar from 'components/Avatar';
import Cover from 'components/Cover';
import EditableText from 'components/EditableText';
import FlatButton from 'components/FlatButton';
import Modal from 'components/Modal';
import PageAvatar from 'components/PageAvatar';
import Preload from 'components/Preload';
import styles from './Channel.scss';

export class Channel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isDeleteModalOpen: false,
		};

		const { username, channelName } = props.match.params;
		this.username = username;
		this.channelName = channelName;

		this.onAvatarUpdate = this.onAvatarUpdate.bind(this);
		this.onCoverUpdate = this.onCoverUpdate.bind(this);
		this.onDeleteChannel = this.onDeleteChannel.bind(this);
		this.onSaveAbout = this.onSaveAbout.bind(this);
		this.startBroadcast = this.startBroadcast.bind(this);
		this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
	}

	onAvatarUpdate(file) {
		this.props.uploadAvatar({ file, username: this.username, channelName: this.channelName });
	}

	onCoverUpdate(file) {
		this.props.uploadCover({ file, username: this.username, channelName: this.channelName });
	}

	onDeleteChannel() {
		this.props.deleteChannel({ username: this.username, channelName: this.channelName });
	}

	onSaveAbout(value) {
		this.props.saveAbout({ value, channelName: this.channelName });
	}

	startBroadcast() {
		this.props.startBroadcast({ channelName: this.channelName });
	}

	toggleDeleteModal() {
		this.setState({ isDeleteModalOpen: !this.state.isDeleteModalOpen });
	}

	render() {
		const {
			content,
			hasContentLoaded,
			isAvatarUploading,
			isCoverUploading,
			payButton,
		} = this.props;

		const {
			isOwner,
			about,
			avatarSrc,
			coverSrc,
			owner,
			name: channelName,
			socialIcons,
		} = content;

		const isPayOn = Boolean(
			payButton && payButton.isStripeConnected && payButton.btnLocations.channel,
		);

		const {
			isDeleteModalOpen,
		} = this.state;

		return (
			<div className={classNames(styles.wrap, isOwner && styles.isOwner)}>
				<Cover
					canEdit={isOwner}
					coverSrc={coverSrc}
					socialIcons={socialIcons}
					updateKey={`${hasContentLoaded}`}
					payButton={isPayOn ? payButton : null}
					userAvatarSrc={owner && owner.avatarSrc}
					username={owner && owner.username ? owner.username : this.username}
					onCoverUpdate={this.onCoverUpdate}
					isUploading={isCoverUploading}
				>
					<Link to={`/${this.username}`} className={styles.owner}>
						<Avatar
							src={owner && owner.avatarSrc}
							title={(owner && owner.username) || ''}
							size="small"
							className={styles.avatar}
						/>
						<span>
							{
								hasContentLoaded && owner ?
								<span>{owner.username} (owner)</span> :
								<Preload oneLine />
							}
						</span>
					</Link>
				</Cover>
				<div className={styles.info}>
					<PageAvatar
						avatarSrc={avatarSrc}
						circle
						isOwner={isOwner}
						title={channelName}
						onAvatarUpdate={this.onAvatarUpdate}
						isUploading={isAvatarUploading}
					/>
					<h1>
						{
							hasContentLoaded ?
							channelName :
							<Preload oneLine />
						}
					</h1>
					<h3>Channel</h3>
				</div>
				<div className={styles.content}>
					<section>
						{
							hasContentLoaded ?
							<div>
								<EditableText
									title="About"
									text={about}
									canEdit={isOwner}
									onSave={this.onSaveAbout}
								/>
								{isOwner &&
									<div>
										<FlatButton
											onClick={this.toggleDeleteModal}
										>
											Delete my channel
										</FlatButton>
										<Modal
											isOpen={isDeleteModalOpen}
											type="alert"
										>
											<h3>Are you sure you want to delete your channel?<br/>
												This cannot be undone.
											</h3>
											<button onClick={this.toggleDeleteModal}>NO</button>
											<button onClick={this.onDeleteChannel}>
												YES<span className="show-medium">, DELETE IT</span>
											</button>
										</Modal>
									</div>
								}
							</div> :
							<Preload blocks={1} lines={8} />
						}
					</section>

					<aside>
						{
							hasContentLoaded ?
							<div>
								{isOwner &&
									<FlatButton
										color="orange"
										className={styles.startBtn}
										onClick={this.startBroadcast}
									>
										Start a Broadcast
									</FlatButton>
								}
								{!isOwner &&
									<div className={styles.broadcastInfo}>
										<img src="images/svg/start-broadcast.svg" />
										<p>Broadcast is offline</p>
									</div>
								}
							</div> :
							<Preload blocks={1} lines={3} />
						}
					</aside>
				</div>
			</div>
		);
	}
}

Channel.propTypes = {
	match: PropTypes.object.isRequired,
	// State
	is404: PropTypes.bool,
	hasContentLoaded: PropTypes.bool,
	content: PropTypes.shape({
		isOwner: PropTypes.bool,
		about: PropTypes.string,
		avatarSrc: PropTypes.string,
		coverSrc: PropTypes.string,
		name: PropTypes.string,
		socialIcons: PropTypes.arrayOf(
			PropTypes.shape(),
		),
		owner: PropTypes.shape({
			username: PropTypes.string,
			avatarSrc: PropTypes.string,
		}),
	}),
	payButton: PropTypes.shape(),
	isAvatarUploading: PropTypes.bool.isRequired,
	isCoverUploading: PropTypes.bool.isRequired,

	// Actions
	deleteChannel: PropTypes.func.isRequired,
	saveAbout: PropTypes.func.isRequired,
	startBroadcast: PropTypes.func.isRequired,
	uploadAvatar: PropTypes.func.isRequired,
	uploadCover: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	payButton: pageSelectors.payButton(state),
	isAvatarUploading: userSelectors.isChannelAvatarUploading(state),
	isCoverUploading: userSelectors.isChannelCoverUploading(state),
});

const mapDispatchToProps = dispatch => ({
	deleteChannel: payload => dispatch(userActions.deleteChannel(payload)),
	saveAbout: payload => dispatch(userActions.saveChannelAbout(payload)),
	startBroadcast: payload => dispatch(broadcastActions.startPublicBroadcast(payload)),
	uploadAvatar: payload => dispatch(userActions.uploadChannelAvatar(payload)),
	uploadCover: payload => dispatch(userActions.uploadChannelCover(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
