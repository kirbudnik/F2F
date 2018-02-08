import React from 'react';
import PropTypes from 'prop-types';
import styles from './Preload.scss';

const Preload = ({ blocks, lines, oneLine }) => (!oneLine
	? (
		<div>
			{Array(blocks).fill().map((a, block) => (
				<div key={block} className={styles.block}>
					{Array(lines).fill().map((b, line) => (
						<div key={line} className={styles.line} />
					))}
				</div>
			))}
		</div>
	) : (
		<span className={styles.line} />
	)
);

Preload.propTypes = {
	blocks: PropTypes.number,
	lines: PropTypes.number,
	oneLine: PropTypes.bool,
};

Preload.defaultProps = {
	blocks: 1,
	lines: 5,
};

export default Preload;
