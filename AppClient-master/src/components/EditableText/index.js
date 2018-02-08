import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Edit2 } from 'components/Icons';
import FlatButton from 'components/FlatButton';
import styles from './EditableText.scss';

const newlineRegex = /(\r\n|\r|\n)/g;

const nl2br = str => str.split(newlineRegex).map((line, index) => {
	if (line.match(newlineRegex)) {
		return React.createElement('br', { key: index });
	}
	return line;
});

class EditableText extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isEditMode: false,
			value: this.props.text,
		};

		this.changeValue = this.changeValue.bind(this);
		this.saveResult = this.saveResult.bind(this);
		this.toggleMode = this.toggleMode.bind(this);
		this.setInputRef = this.setInputRef.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		// This component may be rendered before the intial text has loaded
		if (nextProps.text !== this.props.text && nextProps.text !== this.value) {
			this.setState({ value: nextProps.text });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.isEditMode && !prevState.isEditMode) {
			this.input.focus();
		}
	}

	changeValue(e) {
		this.setState({ value: e.target.value });
	}

	saveResult() {
		this.setState({ isEditMode: false });
		this.props.onSave(this.state.value);
	}

	toggleMode() {
		if (this.state.isEditMode) {
			this.saveResult();
		} else {
			this.setState({ isEditMode: true });
		}
	}

	setInputRef(i) {
		this.input = i;
	}


	render() {
		const { canEdit, title } = this.props;
		const { isEditMode, value } = this.state;

		return (
			<div>
				<h2>{title} {canEdit &&
						<Edit2
							strokeWidth={1.7}
							className={classNames(styles.icon, isEditMode && styles.active)}
							onClick={this.toggleMode}
						/>}
						{isEditMode && <span className={styles.editing}>Editing</span>}
				</h2>
				{isEditMode &&
					<div>
						<textarea
							ref={this.setInputRef}
							className={styles.textarea}
							style={{ width: 'calc(100% + 4rem)', height: 260, maxWidth: 'calc(100% + 4rem)' }}
							value={value}
							onChange={this.changeValue}
						/>
						<div className={styles.buttonGroup}>
							<FlatButton
								color="primary"
								className={styles.save}
								onClick={this.saveResult}
							>
								Save
							</FlatButton>
						</div>
					</div>
				}
				{!isEditMode && <p>{nl2br(value)}</p>}
			</div>
		);
	}
}

EditableText.propTypes = {
	canEdit: PropTypes.bool,
	text: PropTypes.string,
	title: PropTypes.string.isRequired,
	onSave: PropTypes.func.isRequired,
};

EditableText.defaultProps = {
	canEdit: false,
	text: '',
};

export default EditableText;
