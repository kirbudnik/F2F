import React from 'react';
import PropTypes from 'prop-types';
import styles from './Temp.scss';


const Temp = ({ name }) => (
	<div className={styles.container}>
		<span className={styles.name}>{name}</span>
	</div>
);

Temp.propTypes = {
	name: PropTypes.string.isRequired,
};

export default Temp;
