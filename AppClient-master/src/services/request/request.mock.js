export default (URL) => {
	const map = {};

	function add({ method, path }, callback) {
		const keys = [method, ...path.split('/').filter(val => val !== ''), '/'];

		const paramKeys = [];
		let obj = map;

		keys.forEach((key, i) => {
			if (i === keys.length - 1) {
				obj['/'] = {
					callback,
					paramKeys,
				};
			} else if (key.charAt(0) === ':') {
				if (!('*' in obj)) {
					obj['*'] = {};
				}
				obj = obj['*'];
				paramKeys.push(key.slice(1));
			} else {
				if (!(key in obj)) {
					obj[key] = {};
				}
				obj = obj[key];
			}
		});
	}

	function exists(search) {
		const keys = search.map((key) => {
			if (key.charAt(0) === ':') {
				return '*';
			}
			return key;
		});

		let endpoint = map;
		let found = true;

		keys.forEach((key) => {
			if (endpoint instanceof Object) {
				if (key in endpoint) {
					endpoint = endpoint[key];
				} else if ('*' in endpoint) {
					endpoint = endpoint['*'];
				} else {
					found = false;
				}
			} else {
				found = false;
			}
		});

		return found;
	}

	function send({ method, uri, query, body }) {
		const path = new URL(uri).pathname;
		const keys = [method, ...path.split('/').filter(val => val !== ''), '/'];

		if (!exists(keys)) {
			return null;
		}

		return (callback) => {
			let endpoint = map;
			const params = [];

			keys.forEach((key) => {
				if (key in endpoint) {
					endpoint = endpoint[key];
				} else if ('*' in endpoint) {
					endpoint = endpoint['*'];
					params.push(key);
				}
			});

			const req = {
				query: query || {},
				body: body || {},
				params: {},
			};

			if (endpoint.paramKeys) {
				endpoint.paramKeys.forEach((key, i) => {
					req.params[key] = params[i];
				});
			}

			const resp = endpoint.callback(req);

			function respond() {
				if (resp.statusCode >= 400) {
					callback({
						err: 'Status code error',
						body: resp.body,
						statusCode: resp.statusCode,
					});
				} else {
					callback(null, {
						body: resp.body,
						statusCode: resp.statusCode,
					});
				}
			}

			if (Number.isInteger(resp.delay) && resp.delay >= 0) {
				setTimeout(respond, resp.delay);
			} else {
				respond();
			}
		};
	}

	return {
		add,
		send,
	};
};
