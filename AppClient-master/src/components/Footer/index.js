import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { BLOG_URL, FACEBOOK_URL, TWITTER_URL } from 'constants/brand';
import { Facebook, Twitter } from 'components/Icons';
import styles from './Footer.scss';

const icon = {
	size: 22,
};

const Footer = () => (
	<footer className={classNames(styles.footer, 'main-footer')}>
		<div className={styles.inner}>
			<div className={styles.links}>
				<ul className={styles.web}>
					<li>
						<Link to={BLOG_URL} target="_blank" rel="noopener noreferrer">Blog</Link>
					</li>
					<li>
						<Link to="/contact">Contact</Link>
					</li>
					<li>
						<a href="https://blog.f2f.live/" target="_blank" rel="noopener noreferrer">FAQ</a>
					</li>
					<li>
						<a href="https://blog.f2f.live/terms" target="_blank" rel="noopener noreferrer">Terms</a>
					</li>
				</ul>
				<ul className={styles.social}>
					<li>
						<a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
							<Facebook {...icon} />
						</a>
					</li>
					<li>
						<a href={TWITTER_URL} target="_blank" rel="noopener noreferrer">
							<Twitter {...icon} />
						</a>
					</li>
				</ul>
			</div>
			<div className={styles.copyright}>
				&copy; 2017 FaceToFace Broadcasting Corporation
			</div>
		</div>
	</footer>
);

export default Footer;
