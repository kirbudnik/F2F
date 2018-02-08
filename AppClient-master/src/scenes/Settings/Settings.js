import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Route, Link } from 'react-router-dom';
import { Settings as SettingsIcon } from 'components/Icons';
import styles from './Settings.scss';
import AccountDetails from './components/AccountDetails';
import NotApprovedPayments from './components/NotApprovedPayments';
import LoadingError from './components/LoadingError';
import Payments from './components/Payments';
import Transactions from './components/Transactions';

const prefix = '/settings';
const defaultPage = 'account';

const getLink = route => (route !== defaultPage ? `${prefix}/${route}` : prefix);

const routes = {
	account: {
		title: 'Account details',
		component: AccountDetails,
	},
	payments: {
		title: 'Payments',
		component: Payments,
		children: {
			transactions: {
				title: 'Transactions',
				component: Transactions,
			},
		},
	},
};

const reactRoutes = [];
const initRoutes = (level, parent) => {
	Object.keys(level).forEach((route) => {
		reactRoutes.push(
			<Route
				key={route}
				exact
				path={getLink(parent ? `${parent}/${route}` : route)}
				component={level[route].component}
			/>,
		);

		if (level[route].children) {
			initRoutes(level[route].children, route);
		}
	});
};
initRoutes(routes);

class Settings extends React.PureComponent {
	componentWillReceiveProps(nextProps) {
		if (nextProps.isAuth === false) {
			this.props.openLoginModal();
		}
	}

	render() {
		const {
			isAuth,
			isPayApproved,
			isLoading,
			isLoadingError,
			isSaving,
			match,
			username,
			clearLoadingError,
		} = this.props;

		const { params } = match;
		const activePage = params.page || defaultPage;
		const activeTitle = routes[activePage] && routes[activePage].title;
		const childRoute = routes[activePage] && routes[activePage].children;

		return (
			<div className={styles.wrap}>
				<div className={classNames(styles.container, !isAuth && styles.disabled)}>
					<aside>
						<h1><SettingsIcon strokeWidth={1} size={30} /> Settings</h1>
						<h3>{username}</h3>
						<ul>
							{Object.keys(routes).map(route => (
								<li key={route}>
									{
										activePage === route ?
										<strong>{routes[route].title}</strong> :
										<Link to={getLink(route)}>{routes[route].title}</Link>
									}
								</li>
							))}
						</ul>
					</aside>
					{!isLoadingError && (isPayApproved || params.page !== 'payments') &&
						<section className={classNames(isLoading && styles.isLoading)}>
							<header>
								<ul>
									<li>
										{
											!params.subpage || params.page === routes[activePage] ?
											<strong>{activeTitle}</strong> :
											<Link to={getLink(params.page)}>{activeTitle}</Link>

										}
									</li>
									{childRoute && Object.keys(childRoute).map(route => (
										<li key={route}>
											{
												params.subpage === route ?
												<strong>{childRoute[route].title}</strong> :
												<Link to={getLink(`${params.page}/${route}`)}>
													{childRoute[route].title}
												</Link>
											}
										</li>
									))}
								</ul>
								{isSaving && <span className={styles.status}>Saving...</span>}
							</header>
							<div className={styles.content}>
								{reactRoutes}
							</div>
						</section>
					}
					{!isLoadingError && !isPayApproved && params.page === 'payments' &&
						<NotApprovedPayments />
					}
					{isLoadingError &&
						<LoadingError clearLoadingError={clearLoadingError} />
					}
				</div>
			</div>
		);
	}
}

Settings.propTypes = {
	isAuth: PropTypes.bool,
	isPayApproved: PropTypes.bool,
	isLoading: PropTypes.bool.isRequired,
	isLoadingError: PropTypes.bool.isRequired,
	isSaving: PropTypes.bool.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			page: PropTypes.string,
			subpage: PropTypes.string,
		}).isRequired,
	}).isRequired,
	username: PropTypes.string,
	clearLoadingError: PropTypes.func.isRequired,
	openLoginModal: PropTypes.func.isRequired,
};

export default Settings;
