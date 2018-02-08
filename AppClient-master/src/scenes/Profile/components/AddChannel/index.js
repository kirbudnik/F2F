import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userActions, userSelectors } from 'services/user';
import Modal from 'components/Modal';
import styles from './AddChannel.scss';

const AddChannel = ({
	username,
	value,
	channelInputFeedback,
	isModalOpen,
	onChange,
	onSubmit,
	toggleModal,
}) => {
	function handleSubmit(e) {
		e.preventDefault();
		onSubmit();
	}
	function toggleChannelModal() {
		toggleModal(!isModalOpen);
	}

	return (
		<Modal isOpen={isModalOpen} onRequestClose={toggleChannelModal}>
			<form onSubmit={handleSubmit} className={styles.wrap}>
				<h2>Add a channel</h2>
				<h5>Create a unique channel for each of your audiences
					so they can find you easily<br />
				</h5>
				<ul>
					<li>Use only letters, numbers, dashes and underscores.</li>
					<li>Use capitals to make your name looks great. Your audience won&apos;t
						have to use them to reach you</li>
				</ul>
				<p className={styles.channelLink}>
					Your channel: {`${window.location.host}/${username}/${value}`}
				</p>
				<p>
					{channelInputFeedback &&
						<label className="error-label">{channelInputFeedback}</label>
					}
					<input
						type="text"
						onChange={e => onChange(e.target.value.replace(' ', '_'))}
						value={value}
						placeholder="Channel name"
						autoFocus
					/>
				</p>
				<button className="modal-submit" type="submit">
					Submit
				</button>
			</form>
		</Modal>
	);
};

AddChannel.propTypes = {
	// State
	username: PropTypes.string,
	value: PropTypes.string,
	channelInputFeedback: PropTypes.string,
	isModalOpen: PropTypes.bool,
	// Actions
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	toggleModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	username: userSelectors.username(state),
	value: userSelectors.channelInput(state),
	channelInputFeedback: userSelectors.channelInputFeedback(state),
	isModalOpen: userSelectors.isChannelModalOpen(state),
});

const mapDispatchToProps = dispatch => ({
	onChange: value => dispatch(userActions.channelInputChange({ value })),
	onSubmit: () => dispatch(userActions.channelInputSubmit()),
	toggleModal: isOpen => dispatch(userActions.toggleChannelModal({ isOpen })),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddChannel);
