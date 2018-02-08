import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userActions, userSelectors } from 'services/user';
import Modal from 'components/Modal';
import styles from './LoginModal.scss';

const steps = {
	WELCOME: 'welcome',
	FINAL: 'final',
};

class LoginModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			step: null,
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.loginFB = this.loginFB.bind(this);
		this.loginGoogle = this.loginGoogle.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		// Prompt the user for a username if we now have a signup token
		if (nextProps.signupToken && this.state.step !== steps.WELCOME) {
			this.setState({ step: steps.WELCOME });
		}
		if (!nextProps.signupToken && this.state.step === steps.WELCOME) {
			this.setState({ step: null });
		}
	}

	toggleModal() {
		this.props.toggleModal(!this.props.isModalOpen);
	}

	loginFB() {
		this.props.login('facebook');
	}

	loginGoogle() {
		this.props.login('google');
	}

	handleSubmit(evt) {
		evt.preventDefault();
		this.props.usernameInputSubmit();
	}

	render() {
		const { step } = this.state;
		const {
			isModalOpen,
			usernameInputChange,
			usernameInput,
			usernameInputFeedback,
			noOauthAccounts,
		} = this.props;

		return (
			<Modal isOpen={isModalOpen} onRequestClose={this.toggleModal}>
				{!step &&
					<div className={styles.loginWrap}>
						<h2>Log in to get started</h2>
						<p>We keep it simple with only Facebook and Google logins.
							The last thing you need is another password to keep track of!</p>
						<p className={styles.social}>
							<button onClick={this.loginFB}>
								<img src="images/social/fb.png" alt="FB" />
							</button>
							<button onClick={this.loginGoogle}>
								<img src="images/social/google.png" alt="Google" />
							</button>
						</p>
						<a
							href="https://blog.f2f.live/why-we-use-google-and-facebook-for-security/"
							target="_blank"
							rel="noopener noreferrer"
							onClick={noOauthAccounts}
						>
							I don&apos;t have either
						</a>
					</div>
				}
				{step === steps.WELCOME &&
					<form onSubmit={this.handleSubmit}>
						<h2>Welcome!</h2>
						<h3>You are now signed up.<br /> One final step: Choose a username</h3>
						<p className="text-orange">This is how everyone will identify you on the site.</p>
						{usernameInputFeedback &&
							<label className="error-label">{usernameInputFeedback}</label>
						}
						<input
							type="text"
							onChange={e => usernameInputChange(e.target.value.replace(' ', '_'))}
							placeholder="Username"
							value={usernameInput}
							autoFocus
						/>
						<p>
							Use only letters, numbers, dashes and underscores.<br/>24 characters max.<br />
							Keep it friendly, my mom uses this.
						</p>
						<button className="modal-submit" type="submit">
							Submit
						</button>
					</form>
				}
				{step === steps.FINAL &&
					<div>
						<h2>Beautiful!<br /> You are all set up</h2>
						<h3>We really hope you enjoy F2F :)</h3>
						<button className="modal-submit" onClick={this.toggleModal}>
							Great!
						</button>
					</div>
				}
			</Modal>
		);
	}
}

LoginModal.propTypes = {
	isModalOpen: PropTypes.bool,
	signupToken: PropTypes.string,
	usernameInput: PropTypes.string,
	usernameInputFeedback: PropTypes.string,
	login: PropTypes.func.isRequired,
	toggleModal: PropTypes.func.isRequired,
	noOauthAccounts: PropTypes.func.isRequired,
	usernameInputChange: PropTypes.func.isRequired,
	usernameInputSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
	isModalOpen: userSelectors.isLoginModalOpen(store),
	signupToken: userSelectors.signupToken(store),
	usernameInput: userSelectors.usernameInput(store),
	usernameInputFeedback: userSelectors.usernameInputFeedback(store),
});

const mapDispatchToProps = dispatch => ({
	login: platform => dispatch(userActions.login({ platform })),
	toggleModal: isOpen => dispatch(userActions.toggleLoginModal({ isOpen })),
	noOauthAccounts: () => dispatch(userActions.noOauthAccounts()),
	usernameInputChange: value => dispatch(userActions.usernameInputChange({ value })),
	usernameInputSubmit: () => dispatch(userActions.usernameInputSubmit()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
