import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotFound from 'scenes/NotFound';
import ErrorPage from 'scenes/ErrorPage';
import UnlistedNotFound from 'scenes/UnlistedNotFound';
import { broadcastActions, broadcastSelectors } from 'services/broadcast';
import { pageActions, pageSelectors } from 'services/page';
import Broadcast from 'scenes/Broadcast';
import Remount from './RemountHoc';


const isUnlistedBroadcast = path => path === '/:username/-:channelName';

const getBroadcastId = (username, channelName, isUnlisted) =>
	`${username.toLowerCase()}.${isUnlisted ? '-' : ''}${channelName.toLowerCase()}`;


export default (Component) => {
	class PageHoc extends React.Component {
		componentWillMount() {
			this.loadPage(this.props.match);
		}

		componentWillReceiveProps(nextProps) {
			const { history, match } = this.props;

			if (!nextProps.isBroadcastVisible && this.props.isBroadcastVisible) {
				if (isUnlistedBroadcast(match.path)) {
					// Return to profile when unlisted broadcast ends
					history.push(`/${match.params.username}`);
				} else {
					// For public channels, continue to check if broadcast has gone live
					this.reloadTimeout = setTimeout(() => this.loadPage(match), 0);
				}
			}
		}

		componentWillUnmount() {
			clearTimeout(this.reloadTimeout);
			this.props.leaveBroadcast();
		}

		loadPage(match) {
			const { username, channelName } = match.params;

			if (channelName === undefined) {
				this.props.loadPage({ username });
			} else {
				const isUnlisted = isUnlistedBroadcast(match.path);
				const broadcastId = getBroadcastId(username, channelName, isUnlisted);

				this.props.joinBroadcast({ broadcastId });

				if (isUnlisted) {
					// Load user data, there is no channel
					this.props.loadPage({ username });
				} else {
					this.props.loadPage({ username, channelName });
				}
			}
		}

		render() {
			const {
				is404,
				isBroadcast404,
				isLoadingError,
				isBroadcastVisible,
				location,
				match,
			} = this.props;

			if (isLoadingError) {
				return (
					<ErrorPage />
				);
			}

			if (isBroadcastVisible) {
				return (
					<Broadcast />
				);
			}

			if (is404) {
				return (
					<NotFound />
				);
			}

			if (isBroadcast404 && isUnlistedBroadcast(match.path)) {
				return (
					<UnlistedNotFound username={match.params.username}/>
				);
			}

			return <Component key={location.key} {...this.props} />;
		}
	}

	PageHoc.propTypes = {
		hasContentLoaded: PropTypes.bool,
		history: PropTypes.shape().isRequired,
		is404: PropTypes.bool,
		isBroadcast404: PropTypes.bool,
		isLoadingError: PropTypes.bool,
		isBroadcastVisible: PropTypes.bool,
		location: PropTypes.shape(),
		match: PropTypes.shape().isRequired,
		content: PropTypes.shape().isRequired,

		// Actions
		joinBroadcast: PropTypes.func.isRequired,
		leaveBroadcast: PropTypes.func.isRequired,
		loadPage: PropTypes.func.isRequired,
	};

	const mapStateToProps = state => ({
		is404: pageSelectors.is404(state),
		isLoadingError: pageSelectors.isLoadingError(state),
		hasContentLoaded: pageSelectors.hasContentLoaded(state),
		content: pageSelectors.content(state),
		isBroadcast404: broadcastSelectors.isBroadcast404(state),
		isBroadcastVisible: broadcastSelectors.isBroadcastVisible(state),
	});

	const mapDispatchToProps = dispatch => ({
		joinBroadcast: payload => dispatch(broadcastActions.joinBroadcast(payload)),
		leaveBroadcast: () => dispatch(broadcastActions.leaveBroadcast()),
		loadPage: payload => dispatch(pageActions.loadPage(payload)),
	});

	// Wrap so this component will be remounted when the route changes
	// Easier to handle route change logic this way than doing it inside
	// componentWillReceiveProps
	return Remount(connect(mapStateToProps, mapDispatchToProps)(PageHoc));
};
