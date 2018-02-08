import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SimpleBar from 'simplebar';
import styles from './Chat.scss';


class Chat extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			focused: false,
		};

		this.onBlurHandler = this.onBlurHandler.bind(this);
		this.onFocusHandler = this.onFocusHandler.bind(this);
		this.onKeyPressHandler = this.onKeyPressHandler.bind(this);
		this.onSubmitHandler = this.onSubmitHandler.bind(this);
		this.setInputRef = this.setInputRef.bind(this);
		this.setScrollRef = this.setScrollRef.bind(this);
	}

	componentDidMount() {
		if (this.scroll) {
			this.simpleBar = new SimpleBar(this.scroll);
			this.simpleBar.scrollContentEl.scrollTop = this.simpleBar.scrollContentEl.scrollHeight;
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.comments.length > prevProps.comments.length) {
			this.simpleBar.scrollContentEl.scrollTop = this.simpleBar.scrollContentEl.scrollHeight;
		}

		if (!this.props.disabled && prevProps.disabled !== this.props.disabled) {
			if (window.innerWidth >= 768) {
				this.input.focus();
			}
		}
	}

	componentWillUnmount() {
		clearTimeout(this.blurTimer);
	}

	onBlurHandler() {
		this.blurTimer = setTimeout(() => this.setState({ focused: false }), 200);
	}

	onFocusHandler() {
		clearTimeout(this.blurTimer);
		this.setState({ focused: true });
	}

	onKeyPressHandler(e) {
		if (e.which === 13) {
			this.onSubmitHandler(e);
		}
	}

	onSubmitHandler(e) {
		e.preventDefault();
		this.props.onSubmit();

		if (window.innerWidth < 768) {
			this.input.blur();
		}
	}

	setInputRef(c) {
		this.input = c;
	}

	setScrollRef(c) {
		this.scroll = c;
	}

	render() {
		const { disabled, comments, input, placeholder, onChange } = this.props;

		const { focused } = this.state;

		const height = this.input && input.length > 20 && this.input.scrollHeight > 38
			? this.input.scrollHeight
			: 38;

		return (
			<div className={classNames(styles.wrap, focused && styles.focused)}>
				<div ref={this.setScrollRef}>
					<ul className={styles.comments}>
						{comments.map(({ id, username, text, color, textColor, isBold }) =>
							<li key={id}>
								<p>
									<strong style={{ color: textColor }}>
										<a
											style={{ color }}
											href={`/${username}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											{username}:
										</a> {isBold && text}
									</strong> {!isBold && text}
								</p>
							</li>,
						)}
					</ul>
				</div>
				<form onSubmit={this.onSubmitHandler} className={styles.form}>
					<textarea
						ref={this.setInputRef}
						style={{ height }}
						autoComplete="off"
						disabled={disabled}
						name="text"
						placeholder={placeholder}
						type="text"
						value={input}
						onChange={onChange}
						onBlur={this.onBlurHandler}
						onFocus={this.onFocusHandler}
						onKeyPress={this.onKeyPressHandler}
					/>
					<div className={styles.submit}>
						<input
							type="submit"
							value="Send"
							name="submit"
							disabled={disabled || input.length < 1}
						/>
					</div>
				</form>
			</div>
		);
	}
}

Chat.propTypes = {
	disabled: PropTypes.bool,
	comments: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			username: PropTypes.string.isRequired,
			text: PropTypes.string.isRequired,
			color: PropTypes.string.isRequired,
			textColor: PropTypes.string,
			isBold: PropTypes.bool,
		}),
	),
	input: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

Chat.defaultProps = {
	comments: [],
	placeholder: 'Send a message',
};

export default Chat;
