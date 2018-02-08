import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import Avatar from 'components/Avatar';
import styles from './AboutBlock.scss';

const MAX_TEXT_LEN = 60;

const AboutBlock = ({ avatarColor, avatarSrc, history, link, size, text, title }) => (
	<div
		className={classNames(styles.wrap, styles[size])}
		onClick={() => history.push(link)}
	>
		<div>
			<Avatar title={title} size={size} src={avatarSrc} className={styles[avatarColor]} />
		</div>
		<div>
			<h5>{title}</h5>
			{(text && text.length > MAX_TEXT_LEN)
				? `${text.slice(0, MAX_TEXT_LEN)}...`
				: text
			}
		</div>
	</div>
);

AboutBlock.propTypes = {
	avatarColor: PropTypes.oneOf(['alt']),
	avatarSrc: PropTypes.string,
	history: PropTypes.object.isRequired,
	size: PropTypes.oneOf(['small']),
	text: PropTypes.string,
	link: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

export default withRouter(pure(AboutBlock));
