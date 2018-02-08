import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { randomBroadcastNames, MAX_UNLISTED_BROADCAST_NAME_LEN } from 'constants/broadcast';
import { userSelectors } from 'services/user';
import { broadcastActions } from 'services/broadcast';
import { ArrowRight } from 'components/Icons';
import styles from './UnlistedDialog.scss';


const selectInput = e => (e.target.select());

const randomFrom = arr => arr[Math.floor(Math.random() * arr.length)];
const randomName = () =>
	randomFrom(randomBroadcastNames) + String(Math.floor(Math.random() * 1000));


const getInvalidChar = str => str.replace(/[-_a-zA-Z0-9]+/, '').charAt(0);

function nameError(name) {
	if (name === '') {
		return null;
	}
	if (!(/^[-_a-zA-Z0-9]+$/).test(name)) {
		return 'regex';
	}
	if (name.length > MAX_UNLISTED_BROADCAST_NAME_LEN) {
		return 'long';
	}
	return null;
}


class UnlistedDialog extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: randomName(),
			error: null,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		const value = e.target.value.replace(' ', '_');
		const error = nameError(value);

		this.setState({ value, error });
	}

	handleSubmit(e) {
		e.preventDefault();
		if (!this.state.error) {
			this.props.submit(this.state.value);
		}
	}

	render() {
		const { value, error } = this.state;
		const { style, username } = this.props;

		return (
			<div className={styles.wrap} style={style}>
				<form onSubmit={this.handleSubmit}>
					{error === 'regex' &&
						<label className="error-label">
							{`Name cannot contain '${getInvalidChar(value)}'`}
						</label>
					}
					{error === 'long' &&
						<label className="error-label">{'That\'s a bit too long'}</label>
					}
					<div>
						<label>
							Meeting Name
							<input
								type="text"
								value={value}
								onChange={this.handleChange}
								placeholder="Meeting Name"
								autoFocus
								onFocus={selectInput}
							/>
						</label>
						<button type="submit">
							<ArrowRight size={16} strokeWidth={2} />
						</button>
						<div className={styles.link}>
							{`${window.location.host}/${username}/-${value}`}
						</div>
						<div className={styles.note}>Share this URL with your colleagues</div>
					</div>
				</form>
			</div>
		);
	}
}

UnlistedDialog.propTypes = {
	// State
	style: PropTypes.shape(),
	username: PropTypes.string,
	isUnlistedInputValid: PropTypes.bool,

	// Actions
	submit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	username: userSelectors.username(state),
});

const mapDispatchToProps = dispatch => ({
	submit: name => dispatch(broadcastActions.startUnlistedBroadcast({ name })),
});

export default connect(mapStateToProps, mapDispatchToProps)(UnlistedDialog);
