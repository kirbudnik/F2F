const create = type => payload => ({ type, payload });

export const actionTypes = {
	JOIN: 'queue/join',
	LEAVE: 'queue/leave',
	KICK: 'queue/kick',

	GUEST_SUMMON: 'queue/guest/summon',
	GUEST_UNSUMMON: 'queue/guest/unsummon',

	BUBBLE_APPEND: 'queue/bubble/append',
	BUBBLE_REMOVE: 'queue/bubble/remove',

	LOCAL_BUBBLE_SET: 'queue/local_bubble/set',
	LOCAL_BUBBLE_REMOVE: 'queue/local_bubble/remove',

	JOIN_MODAL_TOGGLE: 'queue/join_modal/toggle',

	MARK_AS_VIEWED: 'queue/mark_as_viewed',
};

export default {
	join: create(actionTypes.JOIN),
	leave: create(actionTypes.LEAVE),
	kickFromQueue: create(actionTypes.KICK),

	summonGuest: create(actionTypes.GUEST_SUMMON),
	unsummonGuest: create(actionTypes.GUEST_UNSUMMON),

	appendBubble: create(actionTypes.BUBBLE_APPEND),
	removeBubble: create(actionTypes.BUBBLE_REMOVE),

	setLocalBubble: create(actionTypes.LOCAL_BUBBLE_SET),
	removeLocalBubble: create(actionTypes.LOCAL_BUBBLE_REMOVE),

	toggleJoinModal: create(actionTypes.JOIN_MODAL_TOGGLE),

	markAsViewed: create(actionTypes.MARK_AS_VIEWED),
};
