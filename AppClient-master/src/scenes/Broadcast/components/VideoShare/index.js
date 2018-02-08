import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tooltip from 'rc-tooltip';
import FlatButton from 'components/FlatButton';
import { stripIndents } from 'common-tags';
import { /* Facebook ,*/ Mail, ShareAlt, Twitter } from 'components/Icons';
import styles from './VideoShare.scss';

const socialIcon = {
	size: 32,
	strokeWidth: 0,
};

const shareIcon = {
	size: 24,
	strokeWidth: 0,
	fill: '#fff',
};

const showPopup = (url) => {
	window.open(url, 'newwindow', 'width=600,height=600');
};

// Customized email body depending on the context of the broadcast
const getEmailBody = ({ link, isHost, isLive, isUnlisted, isAutoJoinOn }) => {
	const hostIntro = `${isLive ? 'I\'ve started' : 'I\'m about to start'} an online ${isUnlisted ? 'meeting' : 'broadcast'} using F2F.live. Please join me.`;
	const guestIntro = `${isUnlisted ? 'I\'m in an online meeting on F2F.live. Please join me.' : 'I\'m watching an online broadcast on F2F.live. Come check it out.'}`;

	const autoJoinText = stripIndents`
		- F2F will ask you to log in if it's your first time.
		- A prompt to join should appear automatically. If not, click the "Join" button in the bottom right corner.
	`;

	const regularJoinText = stripIndents`
		- Click the "Join" button at the bottom right corner when you want to turn on your mic and cam.
		- F2F will ask you to log in if it's your first time.
	`;

	return stripIndents`
		${isHost ? hostIntro : guestIntro}

		Here is your link: ${link}

		You'll need these basics:
		- A recent version of Chrome or Firefox on a desktop, laptop, or Android device.
		- A reasonable internet connection.
		- A mic and camera, if you wish to participate.

		Here's how to join the ${isUnlisted ? 'meeting' : 'broadcast'}:
		- Go to ${link} in Chrome or Firefox. You should immediately see and hear me.
		${isAutoJoinOn ? autoJoinText : regularJoinText}
		- Follow the prompts and "Allow" F2F to use your mic and camera.

		Talk to you soon!
	`;
};


class VideoShare extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			copied: false,
		};

		this.canCopy = document.queryCommandSupported ? document.queryCommandSupported('copy') : false;
		this.link = window.location.href;
		this.shortLink = window.location.hostname + window.location.pathname;

		this.copyFullUrl = this.copyFullUrl.bind(this);
		this.copyToClipboard = this.copyToClipboard.bind(this);
		this.selectInput = this.selectInput.bind(this);
		this.setClipboardRef = this.setClipboardRef.bind(this);
		this.setInputRef = this.setInputRef.bind(this);
	}

	componentWillMount() {
		if (this.canCopy) {
			document.addEventListener('copy', this.copyFullUrl);
		}
	}

	componentWillUnmount() {
		if (this.canCopy) {
			document.removeEventListener('copy', this.copyFullUrl);
			clearTimeout(this.timeout);
		}
	}

	copyFullUrl(e) {
		if (e.target.data === this.shortLink
			|| e.target.innerText === this.shortLink
			|| e.target === this.inputRef
		) {
			e.clipboardData.setData('text/plain', this.link);
			e.preventDefault();
		}
	}

	copyToClipboard() {
		if (!this.state.copied) {
			this.clipboardRef.focus();
			this.clipboardRef.select();

			const successful = document.execCommand('copy');
			if (successful) {
				this.setState({ copied: true });
				this.timeout = setTimeout(() => this.setState({ copied: false }), 2000);
			}
		}
	}

	selectInput() {
		if (this.inputRef) {
			this.inputRef.focus();
			this.inputRef.select();
		}
	}

	setClipboardRef(c) {
		this.clipboardRef = c;
	}

	setInputRef(c) {
		this.inputRef = c;
	}

	render() {
		const { isHost, isLive, isUnlisted, isAutoJoinOn } = this.props;
		const { copied } = this.state;
		const { link, shortLink } = this;

		const title = encodeURIComponent('Please join me now on F2F');
		const emailBody = encodeURIComponent(getEmailBody({
			link,
			isHost,
			isLive,
			isUnlisted,
			isAutoJoinOn,
		}));

		return (
			<div className={styles.wrap}>
				<Tooltip placement="bottom" overlayClassName="rc-tooltip-white" trigger={['click']} overlay={
					<div className={styles.overlay}>
						<h4 className={styles.header}>
							Share the link
						</h4>
						{this.canCopy && (
							<div className={classNames('hide-large', styles.copyGroup)}>
								<input
									readOnly
									ref={this.setInputRef}
									value={shortLink}
									className={styles.input}
									onClick={this.selectInput}
								/>
								<FlatButton
									className={styles.copy}
									onClick={this.copyToClipboard}
								>
									{
										copied ?
										<span>Copied</span> :
										<span>Copy link</span>
									}
								</FlatButton>
							</div>
						)}
						<div className={styles.socialIcons}>
							<a onClick={() => showPopup(`https://twitter.com/intent/tweet?text=${title}&url=${link}`)}>
								<Twitter {...socialIcon} />
							</a>
							{/* <a onClick={() => showPopup(`http://www.facebook.com/share.php?u=${link}&title=${title}`)}>
								<Facebook {...socialIcon} />
							</a> */}
							<a href={`mailto:?subject=${title}&body=${emailBody}`}>
								<Mail {...socialIcon} />
							</a>
						</div>
					</div>
				}>
					<ShareAlt {...shareIcon} className={styles.shareIcon} />
				</Tooltip>

					<span className={classNames('show-large', styles.largeLink)}>
						<span>{shortLink}</span>
						{this.canCopy &&
							<span className={styles.largeCopy}>
								{copied ?
									<span>Copied</span> :
									<a onClick={this.copyToClipboard}>Copy</a>
								}
							</span>
						}
					</span>
				<textarea
					ref={this.setClipboardRef}
					readOnly
					style={{ position: 'absolute', left: -9999, top: -9999 }}
					value={link}
				/>
			</div>
		);
	}
}

VideoShare.propTypes = {
	isHost: PropTypes.bool,
	isLive: PropTypes.bool,
	isUnlisted: PropTypes.bool,
	isAutoJoinOn: PropTypes.bool,
};

export default VideoShare;
