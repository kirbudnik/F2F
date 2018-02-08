import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { discoverActions, discoverSelectors } from 'services/discover';
import { userActions, userSelectors } from 'services/user';
import Logo from 'components/Logo';
import { ChevronDown } from 'components/Icons';
import styles from './Header.scss';
import Discover from './components/Discover';
import Menu from './components/Menu';


export const Header = ({ menu, isAuth, isDiscoverOpen, openLoginModal, toggleDiscover }) => (
	<div className="main-header">
		<header role="banner" className={styles.header}>
			<div className={styles.inner}>
				<Link to="/">
					<Logo className={styles.logo} />
				</Link>
				<a className={styles.discover} onClick={toggleDiscover}>
					Discover{' '}
					<ChevronDown strokeWidth={1.4} className={classNames(isDiscoverOpen && styles.open)} />
				</a>
				<nav role="navigation" className={styles.nav}>
					<Menu nav={menu} isAuth={isAuth} openLoginModal={openLoginModal} />
				</nav>
			</div>
		</header>
		<Discover isOpen={isDiscoverOpen} />
	</div>
);

Header.propTypes = {
	isAuth: PropTypes.bool,
	isDiscoverOpen: PropTypes.bool,
	menu: PropTypes.arrayOf(PropTypes.shape()),
	openLoginModal: PropTypes.func.isRequired,
	toggleDiscover: PropTypes.func.isRequired,
};


const mapStateToProps = store => ({
	isAuth: userSelectors.isAuth(store),
	isDiscoverOpen: discoverSelectors.isOpen(store),
	menu: userSelectors.authHeaderMenu(store),
});

const mapDispatchToProps = dispatch => ({
	toggleDiscover: () => dispatch(discoverActions.toggleDiscover()),
	openLoginModal: () => dispatch(userActions.toggleLoginModal({ isOpen: true })),
});


export default connect(mapStateToProps, mapDispatchToProps)(Header);
