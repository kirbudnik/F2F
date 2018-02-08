import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import classNames from 'classnames';
import ImageUpload from 'components/ImageUpload';
import Spinner from 'components/Spinner';
import { Edit2 } from 'components/Icons';
import styles from './PageAvatar.scss';

const PageAvatar = ({
	avatarSrc,
	circle,
	className,
	isOwner,
	isUploading,
	title,
	onAvatarUpdate,
}) => (
	<div
		className={classNames(styles.avatar, circle && styles.circle, className)}
		style={{ backgroundImage: avatarSrc && `url(${avatarSrc})` }}
	>
		{!avatarSrc && title && title[0]}
		{isOwner &&
			<ImageUpload
				className={styles.avatarEdit}
				id="ImageUpload_avatar"
				onFileReady={onAvatarUpdate}
			>
				{isUploading ?
					<span className={styles.icon}>
						<Spinner inline />
					</span> :
					<Edit2
						strokeWidth={1.4}
						className={styles.icon}
					/>
				}
			</ImageUpload>
		}
	</div>
);

PageAvatar.propTypes = {
	avatarSrc: PropTypes.string,
	circle: PropTypes.bool,
	className: PropTypes.string,
	isOwner: PropTypes.bool,
	isUploading: PropTypes.bool,
	title: PropTypes.string,
	onAvatarUpdate: PropTypes.func.isRequired,
};

export default pure(PageAvatar);
