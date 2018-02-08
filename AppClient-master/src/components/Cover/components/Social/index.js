import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { InstagramAlt, MailAlt, Twitter } from 'components/Icons';
import styles from './Social.scss';

const icon = {
	size: 20,
	fill: '#000',
	strokeWidth: 0,
};

const getIcon = (network) => {
	switch (network) {
		case 'instagram': {
			return InstagramAlt;
		}
		case 'mail': {
			return MailAlt;
		}
		case 'twitter': {
			return Twitter;
		}
		default: {
			return null;
		}
	}
};

const Social = ({ link, network }) => (
	<a href={link} target={network !== 'mail' ? '_blank' : undefined} title={link}>
		{React.createElement(
			getIcon(network),
			{ ...icon, className: classNames(styles.icon, styles[network]) },
		)}
	</a>
);

Social.propTypes = {
	link: PropTypes.string,
	network: PropTypes.oneOf(['instagram', 'mail', 'twitter']),
};

export default Social;
