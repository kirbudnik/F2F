import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pure from 'recompose/pure';
import { withRouter } from 'react-router-dom';
import {
	CheckboxFilled,
	// FacebookLive,
	Square,
	YoutubeLive,
} from 'components/Icons';
import styles from './GoLive.scss';

const iconCheckbox = {
	strokeWidth: 1.5,
	size: 30,
};

const iconCheckboxFilled = {
	strokeWidth: 0,
	fill: '#fff',
	size: iconCheckbox.size,
};


const iconSocialLive = {
	strokeWidth: 0,
	size: 22,
	fill: 'rgba(255, 255, 255, .9)',
};

const GoLive = ({
	isLive,
	isUnlisted,
	goLiveClick,
	isYoutubeLive,
	hasYoutubeKey,
	youtubeBtnClick,
}) => (
	isLive ? (
		<div className={classNames(styles.isLive, 'show-medium')}>
			<div className={isYoutubeLive && styles.dot} onClick={youtubeBtnClick}>
				<YoutubeLive {...iconSocialLive} />
				{isYoutubeLive
					? <span>Stop YouTube Stream</span>
					: <span>Stream to YouTube</span>
				}
			</div>
			{ /* <div className={isFacebookLive && styles.dot} onClick={onYoutubeToggle}>
				<FacebookLive {...iconSocialLive} /> <span>Broadcast on Facebook</span>
			</div> */ }
		</div>
	) : (
		<div className={styles.notLive}>
			<h3 className="show-medium">
				{isUnlisted ? 'You have not started the meeting yet' : 'You are not currently live'}
			</h3>
			<button className={styles.goLive} onClick={goLiveClick}>
				{isUnlisted ? 'Start Meeting' : 'Go Live'}
			</button>
			<div className={styles.checkGroup}>
				<label onClick={youtubeBtnClick}>
					<span>
						{hasYoutubeKey
							? <CheckboxFilled {...iconCheckboxFilled} />
							: <Square {...iconCheckbox} />}
					</span>
					<span>Stream and record on YouTube</span>
				</label>
				{ /* <label onClick={onFacebookToggle}>
					<span>
						{isFacebookLive
							? <CheckboxFilled {...iconCheckboxFilled} />
							: <Square {...iconCheckbox} />}
					</span>
					<span>Go live<br /> on Facebook</span>
				</label> */ }
			</div>
		</div>
	)
);

GoLive.propTypes = {
	isLive: PropTypes.bool,
	isUnlisted: PropTypes.bool,
	goLiveClick: PropTypes.func.isRequired,
	isYoutubeLive: PropTypes.bool,
	hasYoutubeKey: PropTypes.bool.isRequired,
	youtubeBtnClick: PropTypes.func.isRequired,
};

export default withRouter(pure(GoLive));
