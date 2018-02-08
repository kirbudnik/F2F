import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import LoginModal from 'components/LoginModal';
import { ChevronDown, MoreHorizontal } from 'components/Icons';
import styles from './Menu.scss';

const getMenuName = (level, index) => `menu${level}${index}`;

const initialState = {
	isOpen: false,
	openedMenu: {},
};

class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = initialState;

		this.toggleMenu = this.toggleMenu.bind(this);
		this.renderMenu = this.renderMenu.bind(this);
		this.clickOutside = this.clickOutside.bind(this);
		this.setMenuRef = this.setMenuRef.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.clickOutside);

		this.unlisten = this.props.history.listen(() => {
			this.setState(initialState);
		});
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.clickOutside);
		this.unlisten();
	}

	clickOutside(event) {
		if (this.menuRef && !this.menuRef.contains(event.target)) {
			if (this.state.isOpen || Object.keys(this.state.openedMenu).length) {
				this.setState({ ...initialState });
			}
		}
	}

	toggleMenu() {
		this.setState({ isOpen: !this.state.isOpen });
	}

	toggleSubMenu(level, index) {
		const menuName = getMenuName(level, index);
		this.setState({
			openedMenu: {
				...this.state.openedMenu,
				[menuName]: !this.state.openedMenu[menuName],
			},
		});
	}

	setMenuRef(c) {
		this.menuRef = c;
	}

	renderMenu(array, level = 0, isVisible) {
		const { openedMenu } = this.state;

		return (isVisible || !level) ? (
			<ul>
				{array.map(({ link, title, img }, i) => (!!link.length &&
					<li key={i} className={classNames({ [styles.subMenu]: Array.isArray(link) })}>
						{Array.isArray(link)
							? (
									<span onClick={() => this.toggleSubMenu(level, i)}>
										{img && <img src={img} />}
										{title}
										<ChevronDown
											className={classNames(
												styles.chevron,
												openedMenu[getMenuName(level, i)] && level > 0 && styles.rotate,
											)}
										/>
									</span>
								)
							: <Link to={link}>{title}</Link>
						}
						{Array.isArray(link)
							&& this.renderMenu(link, level + 1, openedMenu[getMenuName(level, i)])}
					</li>
				))}
			</ul>
		) : (
			null
		);
	}

	render() {
		const { isOpen } = this.state;
		const { nav, isAuth } = this.props;

		return isAuth ? (
			<div ref={this.setMenuRef}>
				<MoreHorizontal className={styles.navToggleBtn} onClick={this.toggleMenu} />
				<nav className={
					classNames(styles.nav, { [styles.open]: isOpen }, { [styles.closed]: !isOpen })
				}>
					<div className="show-medium">
						{this.renderMenu(nav)}
					</div>
					<div className="hide-medium">
						{this.renderMenu(nav.length === 1 ? nav[0].link : nav)}
					</div>
				</nav>
			</div>
		) :
		(
			<div>
				<a className={styles.login} onClick={this.props.openLoginModal}>Login</a>
				<LoginModal />
			</div>
		);
	}
}

Menu.propTypes = {
	history: PropTypes.shape({
		listen: PropTypes.func.isRequired,
	}).isRequired,
	isAuth: PropTypes.bool,
	nav: PropTypes.array.isRequired,
	openLoginModal: PropTypes.func.isRequired,
};

export default withRouter(Menu);
