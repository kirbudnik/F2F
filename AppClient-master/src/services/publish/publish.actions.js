const create = type => payload => ({ type, payload });

export const actionTypes = {
	MIC_SELECT: 'publish/mic/select',
	MIC_CLICK: 'publish/mic/click',

	CAMERA_SELECT: 'publish/camera/select',
	CAMERA_CLICK: 'publish/camera/click',

	SPEAKER_SELECT: 'publish/speaker/select',

	SCREEN_CLICK: 'publish/screen/click',

	GUEST_PUBLISH: 'publish/guest',

	TRIAL_PUBLISH: 'publish/trial',

	BTN_TOGGLE: 'publish/btn/toggle',
};

export default {
	selectMic: create(actionTypes.MIC_SELECT),
	micBtnClick: create(actionTypes.MIC_CLICK),

	selectCamera: create(actionTypes.CAMERA_SELECT),
	cameraBtnClick: create(actionTypes.CAMERA_CLICK),

	selectSpeaker: create(actionTypes.SPEAKER_SELECT),

	screenBtnClick: create(actionTypes.SCREEN_CLICK),

	guestPublish: create(actionTypes.GUEST_PUBLISH),

	trialPublish: create(actionTypes.TRIAL_PUBLISH),

	toggleBtns: create(actionTypes.BTN_TOGGLE),
};
