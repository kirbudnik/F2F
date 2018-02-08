import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import styles from './Body.scss';

const Body = ({ buttonText, buttonOnClick, text, title }) => (
	<div className={styles.f2fBody}>
		<section className={styles.innerContainer}>
			<h2>{title}</h2>
			{text}
			<div className={styles.btnContainer}>
				<div className={styles.btnWrap}>
					<Button type="orange" className={styles.f2fBtn} onClick={buttonOnClick}>
						{buttonText}
					</Button>
				</div>
			</div>
		</section>
	</div>
);

Body.propTypes = {
	buttonText: PropTypes.string.isRequired,
	buttonOnClick: PropTypes.func,
	text: PropTypes.node.isRequired,
	title: PropTypes.string.isRequired,
};

export default Body;
