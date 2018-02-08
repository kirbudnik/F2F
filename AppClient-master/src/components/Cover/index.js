import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import ImageUpload from 'components/ImageUpload';
import PayButton from 'components/PayButton';
import Social from 'components/Cover/components/Social';
import Spinner from 'components/Spinner';
import { Edit2 } from 'components/Icons';
import defaultImage from 'images/banner/default-poligon.jpg';
import styles from './Cover.scss';

const coverAspect = 5.8 / 1;

const Cover = ({
	canEdit,
	children,
	coverSrc,
	isUploading,
	payButton,
	socialIcons,
	userAvatarSrc,
	username,
	onCoverUpdate,
}) => {
	const url = coverSrc || defaultImage;

	return (
		<div
			className={styles.cover}
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .1) 60%, rgba(0, 0, 0, .35) 100%), url(${url})`,
			}}
		>
			<div className={styles.container}>
				{canEdit &&
					<ImageUpload
						aspect={coverAspect}
						className={styles.coverEdit}
						id="ImageUpload_cover"
						onFileReady={onCoverUpdate}
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
				{children}
				{(socialIcons || payButton) && (
					<div className={styles.socialIcons}>
						{payButton &&
							<PayButton {...payButton} username={username} avatarSrc={userAvatarSrc} />}
						{socialIcons && socialIcons.map(social => <Social key={social.network} {...social} />)}
					</div>
				)}
			</div>
		</div>
	);
};

Cover.propTypes = {
	canEdit: PropTypes.bool,
	children: PropTypes.node,
	coverSrc: PropTypes.string,
	isUploading: PropTypes.bool,
	payButton: PropTypes.shape(PayButton.propTypes),
	socialIcons: PropTypes.arrayOf(
		PropTypes.shape(Social.propTypes),
	),
	updateKey: PropTypes.string,
	userAvatarSrc: PropTypes.string,
	username: PropTypes.string,
	onCoverUpdate: PropTypes.func.isRequired,
};

export default onlyUpdateForKeys([
	'coverSrc',
	'children',
	'socialIcons',
	'payButton',
	'updateKey',
	'isUploading',
])(Cover);
