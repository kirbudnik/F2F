import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { pageSelectors } from 'services/page';
import { userActions, userSelectors } from 'services/user';
import { PlusCircle } from 'components/Icons';
import AboutBlock from 'components/AboutBlock';
import Cover from 'components/Cover';
import EditableText from 'components/EditableText';
import FlatButton from 'components/FlatButton';
import PageAvatar from 'components/PageAvatar';
import Preload from 'components/Preload';
import AddChannel from './components/AddChannel';
import UnlistedDialog from './components/UnlistedDialog';
import styles from './Profile.scss';

export class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isUnlistedDialogOpen: false,
		};

		this.username = props.match.params.username;

		this.clickOutside = this.clickOutside.bind(this);
		this.toggleUnlistedDialog = this.toggleUnlistedDialog.bind(this);
		this.setUnlistedDialogRef = this.setUnlistedDialogRef.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.clickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.clickOutside);
	}

	clickOutside(event) {
		if (this.state.isUnlistedDialogOpen
				&& this.unlistedDialogRef
				&& !this.unlistedDialogRef.contains(event.target)) {
			this.setState({ isUnlistedDialogOpen: false });
		}
	}

	toggleUnlistedDialog() {
		this.setState({ isUnlistedDialogOpen: !this.state.isUnlistedDialogOpen });
	}

	setUnlistedDialogRef(c) {
		this.unlistedDialogRef = c;
	}

	render() {
		const {
			hasContentLoaded,
			content,
			uploadAvatar,
			uploadCover,
			saveAbout,
			isAvatarUploading,
			isCoverUploading,
			payButton,
			openChannelModal,
		} = this.props;

		const {
			about,
			avatarSrc,
			channels,
			coverSrc,
			isOwner,
			socialIcons,
			username,
		} = content;

		const {
			isUnlistedDialogOpen,
		} = this.state;

		const isPayOn = Boolean(
			payButton && payButton.isStripeConnected && payButton.btnLocations.profile,
		);

		return (
			<div className={styles.wrap}>
				<Cover
					canEdit={isOwner}
					coverSrc={coverSrc}
					socialIcons={socialIcons}
					updateKey={`${hasContentLoaded}-${avatarSrc}`}
					payButton={isPayOn ? payButton : null}
					userAvatarSrc={avatarSrc}
					username={username}
					onCoverUpdate={uploadCover}
					isUploading={isCoverUploading}
				>
					<PageAvatar
						avatarSrc={avatarSrc}
						className={styles.avatar}
						isOwner={isOwner}
						title={username}
						onAvatarUpdate={uploadAvatar}
						isUploading={isAvatarUploading}
					/>
					<div className={styles.avatarText}>
						<h1>
							{
								hasContentLoaded ?
								username :
								<Preload oneLine />
							}
						</h1>
						<h3>Broadcaster</h3>
					</div>
				</Cover>
				{isOwner &&
					<div className={classNames(styles.content, styles.buttons)}>
						<div className={styles.btnWrap}>
							<div
								ref={this.setUnlistedDialogRef}
								className={styles.unlistedGroup}
							>
								<FlatButton
									color="orange"
									className={classNames(styles.btn, isUnlistedDialogOpen && styles.active)}
									onClick={this.toggleUnlistedDialog}
								>
									Start a Meeting
								</FlatButton>
								{isUnlistedDialogOpen && <UnlistedDialog />}
							</div>
						</div>
					</div>
				}
				<div className={styles.content}>
					<section>
						{
							hasContentLoaded ?
							<EditableText
								text={about}
								title="About Me"
								canEdit={isOwner}
								onSave={saveAbout}
							/> :
							<Preload blocks={1} lines={5} />
						}
					</section>
					<aside>
						<div>
							{hasContentLoaded && Array.isArray(channels) && (
								<div className={styles.aboutWrap}>
									<h2>
										Channels
										{isOwner &&
											<PlusCircle
												size={29}
												strokeWidth={0.9}
												className={styles.plus}
												onClick={openChannelModal}
											/>
										}
									</h2>
									{isOwner && <AddChannel />}
									{
										channels.map(channel => (
											<AboutBlock
												key={channel.lowercaseName}
												avatarColor="alt"
												avatarSrc={channel.avatarSrc}
												link={`/${username}/${channel.name}`}
												size="small"
												title={channel.name}
											/>
										))
									}
								</div>
							)}
							{!hasContentLoaded && <Preload blocks={1} lines={6} />}
						</div>
					</aside>
				</div>
			</div>
		);
	}
}

Profile.propTypes = {
	match: PropTypes.object.isRequired,
	// State
	is404: PropTypes.bool,
	hasContentLoaded: PropTypes.bool,
	content: PropTypes.shape({
		about: PropTypes.string,
		avatarSrc: PropTypes.string,
		channels: PropTypes.array,
		coverSrc: PropTypes.string,
		isOwner: PropTypes.bool,
		socialIcons: PropTypes.arrayOf(
			PropTypes.shape(),
		),
		username: PropTypes.string,
	}),
	payButton: PropTypes.shape(),
	isAvatarUploading: PropTypes.bool.isRequired,
	isCoverUploading: PropTypes.bool.isRequired,
	// Actions
	uploadAvatar: PropTypes.func.isRequired,
	uploadCover: PropTypes.func.isRequired,
	saveAbout: PropTypes.func.isRequired,
	openChannelModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	payButton: pageSelectors.payButton(state),
	isAvatarUploading: userSelectors.isUserAvatarUploading(state),
	isCoverUploading: userSelectors.isUserCoverUploading(state),
});

const mapDispatchToProps = dispatch => ({
	uploadAvatar: file => dispatch(userActions.uploadUserAvatar({ file })),
	uploadCover: file => dispatch(userActions.uploadUserCover({ file })),
	saveAbout: value => dispatch(userActions.saveUserAbout({ value })),
	openChannelModal: () => dispatch(userActions.toggleChannelModal({ isOpen: true })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
