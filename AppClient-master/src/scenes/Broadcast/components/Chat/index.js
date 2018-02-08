import { connect } from 'react-redux';
import { chatActions, chatSelectors } from 'services/chat';
import Chat from './Chat';

const mapStateToProps = state => ({
	disabled: chatSelectors.disabled(state),
	comments: chatSelectors.comments(state),
	input: chatSelectors.input(state),
});

const mapDispatchToDrops = dispatch => ({
	onChange: e => dispatch(chatActions.inputChange({ value: e.target.value })),
	onSubmit: () => dispatch(chatActions.submitAttempt()),
});

export default connect(mapStateToProps, mapDispatchToDrops)(Chat);
