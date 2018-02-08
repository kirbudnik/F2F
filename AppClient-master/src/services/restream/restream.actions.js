const create = type => payload => ({ type, payload });
const createEmpty = type => () => ({ type });

export const actionTypes = {
	YOUTUBE_BTN_CLICK: 'restream/youtube/click',
	YOUTUBE_SET_KEY: 'restream/youtube/key/set',
	YOUTUBE_REMOVE_KEY: 'restream/youtube/key/remove',
};

export default {
	youtubeBtnClick: create(actionTypes.YOUTUBE_BTN_CLICK),
	setYoutubeKey: create(actionTypes.YOUTUBE_SET_KEY),
	removeYoutubeKey: createEmpty(actionTypes.YOUTUBE_REMOVE_KEY),
};
