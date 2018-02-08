import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Header from 'components/Header';
import Footer from 'components/Footer';
import styles from './Main.scss';

const Main = ({
	disableHeader,
	disableFooter,
	children,
	className,
}) => (
	<div className={classNames(styles.wrap, className)}>
		<div className={styles.topGroup}>
			{!disableHeader && <Header />}
			{children}
		</div>
		{!disableFooter && <Footer />}
	</div>
);

Main.propTypes = {
	disableHeader: PropTypes.bool,
	disableFooter: PropTypes.bool,
	children: PropTypes.node,
	className: PropTypes.string,
};


export default Main;
