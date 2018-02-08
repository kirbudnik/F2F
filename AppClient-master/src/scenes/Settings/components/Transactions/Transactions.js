import React from 'react';
import PropTypes from 'prop-types';
import styles from './Transactions.scss';

function minTwoDigits(num) {
	return (num < 10 ? '0' : '') + num;
}

// FIXME - I imagine it is innefficient to do this while rendering. We should probably
// do it in the epic
const formatDate = date =>
	`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${minTwoDigits(date.getHours())}:${minTwoDigits(date.getMinutes())}:${minTwoDigits(date.getSeconds())}`;

class Transactions extends React.PureComponent {
	componentWillMount() {
		this.props.loadData({ uri: 'pay' });
	}

	render() {
		const { payments } = this.props;

		return (
			<div className={styles.wrap}>
				<table className="sort-table">
					<thead>
						<tr>
							<th>Date</th>
							<th>From</th>
							<th>Amount</th>
						</tr>
					</thead>
					<tbody>
						{payments
							.sort((a, b) => a.createdAt < b.createdAt)
							.map(({ id, amount, senderUsername, createdAt }) => (
							<tr key={id}>
								<td>{formatDate(new Date(createdAt * 1000))}</td>
								<td>{senderUsername}</td>
								<td>${(amount / 100).toFixed(2)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}

Transactions.propTypes = {
	payments: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		amount: PropTypes.number.isRequired,
		senderUsername: PropTypes.string,
		createdAt: PropTypes.number.isRequired,
	})),
	loadData: PropTypes.func.isRequired,
};

export default Transactions;
