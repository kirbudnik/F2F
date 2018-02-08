import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingError.scss';

const LoadingError = ({ clearLoadingError }) => (
	<section className={styles.wrap}>
		<h3>We were unable to load your settings</h3>
		<h4><a onClick={clearLoadingError}>Click here to retry</a></h4>
	</section>
);

LoadingError.propTypes = {
	clearLoadingError: PropTypes.func.isRequired,
};

export default LoadingError;
