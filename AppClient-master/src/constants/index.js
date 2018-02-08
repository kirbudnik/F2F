export const DEBUG = process.env.NODE_ENV !== 'production';

export const BASE_API_PATH = `${window.location.protocol}//${window.location.host}/api`;

export const alertTypes = {
	ERROR: 'error',
	INFO: 'info',
	SUCCESS: 'success',
};

export const browserDownloads = {
	CHROME: 'https://www.google.ca/chrome',
	FIREFOX: 'https://www.mozilla.org',
};

export const CHROME_EXTENSION_LINK = 'https://chrome.google.com/webstore/detail/f2f-screen-sharing/dadbkaghakenpcikaemgfbaaomcibggo';
export const YOUTUBE_ENABLE_STREAMING_LINK = 'https://support.google.com/youtube/answer/2474026?hl=en';
