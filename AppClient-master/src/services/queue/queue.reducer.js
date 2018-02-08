const MAX_QUEUE_SIZE = 50;

const initialState = {
	bubbles: [],
	localBubble: null,
	isJoinModalOpen: false,
	lastViewedBubbles: [],
};

const handleActions = handlers => (state = initialState, action) => {
	if (action.type in handlers) {
		return handlers[action.type](state, action.payload);
	}
	return state;
};

function findBubbleById(bubbles, clientId) {
	for (let i = 0; i < bubbles.length; i += 1) {
		if (bubbles[i].clientId === clientId) {
			return i;
		}
	}
	return null;
}

export default ({ actionTypes, broadcastActionTypes }) => handleActions({
	[broadcastActionTypes.BROADCAST_LEAVE]: () => initialState,

	[actionTypes.BUBBLE_APPEND]: (state, payload) => ({
		...state,
		bubbles: state.bubbles.length < MAX_QUEUE_SIZE ?
		[
			...state.bubbles,
			payload,
		] :
		[
			...state.bubbles,
		],
	}),

	[actionTypes.BUBBLE_REMOVE]: (state, { clientId }) => {
		const bubbles = state.bubbles;
		const index = findBubbleById(bubbles, clientId);

		if (index !== null) {
			return {
				...state,
				bubbles: [
					...bubbles.slice(0, index),
					...bubbles.slice(index + 1),
				],
			};
		}
		return state;
	},

	[actionTypes.LOCAL_BUBBLE_SET]: (state, payload) => ({
		...state,
		localBubble: payload,
	}),

	[actionTypes.LOCAL_BUBBLE_REMOVE]: state => ({
		...state,
		localBubble: null,
	}),

	[actionTypes.JOIN_MODAL_TOGGLE]: (state, { isOpen }) => ({
		...state,
		isJoinModalOpen: isOpen,
	}),

	[actionTypes.MARK_AS_VIEWED]: state => ({
		...state,
		lastViewedBubbles: state.bubbles.map(({ clientId }) => clientId),
	}),
});


// Selectors
const selectors = {};
Object.keys(initialState).forEach((key) => {
	selectors[key] = state => state.queue[key];
});


// Reselect
export const Selectors = createSelector => ({
	...selectors,
	localBubbleSrc: createSelector(
		[selectors.localBubble],
		(localBubble) => {
			if (localBubble) {
				return localBubble.imgSrc;
			}
			return null;
		},
	),
});
