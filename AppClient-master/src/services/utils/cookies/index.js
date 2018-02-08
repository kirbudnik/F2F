function get(name) {
	const cookie = typeof document !== 'undefined' ? document.cookie : '';

	if (!cookie) {
		return null;
	}
	return cookie
		.split(';')
		.map(c => c.trim())
		.filter(c => c.substring(0, name.length + 1) === `${name}=`)
		.map(c => decodeURIComponent(c.substring(name.length + 1)))[0] || null;
}

// exp is in seconds
function set({ name, value, exp, domain }) {
	const date = new Date();
	const domainStr = domain ? `; domain=${domain}` : '';

	date.setTime(date.getTime() + (exp * 1000));
	if (typeof document !== 'undefined') {
		document.cookie = `${name}=${value}; expires=${date.toUTCString()}${domainStr}; path=/`;
	}
}

export default {
	get,
	set,
};
