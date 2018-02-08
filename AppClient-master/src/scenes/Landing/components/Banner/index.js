import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from 'components/Button';
import styles from './Banner.scss';

const Banner = ({ buttonOnClick, buttonText, header, id, list, text }) => (
	<div className={classNames(styles.f2fBanner, styles[`f2fBannerSlide${id}`])}>
		<div className={styles.f2fBannerInner}>
			<div className={styles.f2fBannerContent}>
				<div>
					<h1>{header}</h1>
					{text}
				</div>
				<div className={styles.btnContainer}>
					<Button className={styles.f2fBtn} onClick={buttonOnClick}>{buttonText}</Button>
				</div>
				<div className={styles.f2fBannerListContainer}>
					<ul>
						{list.map((item, i) => <li key={i}>{item}</li>)}
					</ul>
				</div>
			</div>
		</div>
	</div>
);

Banner.propTypes = {
	buttonOnClick: PropTypes.func,
	buttonText: PropTypes.string.isRequired,
	header: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	list: PropTypes.array.isRequired,
	text: PropTypes.node.isRequired,
};

export default Banner;
