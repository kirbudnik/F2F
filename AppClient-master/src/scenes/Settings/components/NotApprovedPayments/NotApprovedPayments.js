import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as typeformEmbed from '@typeform/embed';
import { DEBUG } from 'constants/index';
import FlatButton from 'components/FlatButton';
import styles from './NotApprovedPayments.scss';


const NotApprovedPayments = ({
	username,
	email,
	hasApplied,
	onApplied,
}) => {
	const onButtonClick = () => {
		if (username && email) {
			if (DEBUG) {
				// Don't fill out the typeform form locally
				onApplied();
			} else {
				typeformEmbed.makePopup(
					`https://alex2472.typeform.com/to/jpEMvH?username=${username}&email=${email}`,
					{
						mode: 'popup',
						autoOpen: true,
						autoClose: 1000,
						onSubmit: onApplied,
					},
				);
			}
		}
	};

	return (
		<section className={styles.wrap}>
			{!hasApplied &&
				<div>
					<h3>You are not currently set up for payments.</h3>
					<h4>Click the link to apply for F2F Pay.</h4>
					<FlatButton className={styles.btn} onClick={onButtonClick} color="orange">
						Apply Now
					</FlatButton>
				</div>
			}
			{hasApplied &&
				<div>
					<h3>Awesome!</h3>
					<h4>We&apos;ve received your application to use F2F Pay.<br/>
						We&apos;ll review it as soon as possible.</h4>
					<span>Please <Link to="/contact">contact us</Link> if you have any questions</span>
				</div>
			}
		</section>
	);
};

NotApprovedPayments.propTypes = {
	username: PropTypes.string,
	email: PropTypes.string,
	hasApplied: PropTypes.bool,
	onApplied: PropTypes.func.isRequired,
};

export default NotApprovedPayments;
