Object.values = obj => Object.keys(obj).map(key => obj[key]);

const fakeMatchMedia = () => ({
	matches: false,
	addListener: () => {},
	removeListener: () => {},
});

window.matchMedia = window.matchMedia || fakeMatchMedia;
