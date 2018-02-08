export default (superagent, cookies, options) => {
	// Parse a json string and return a dictionary
	function parseJsonDict(json) {
		if (typeof json !== 'string') {
			return {};
		}
		try {
			const dict = JSON.parse(json);

			return dict instanceof Object ? dict : {};
		} catch (err) {
			return {};
		}
	}

	function intOrDefault(statusCode, num) {
		if (Number.isInteger(statusCode)) {
			return statusCode;
		}
		return num;
	}

	// "Double-send" the csrf token to protect against csrf attacks.
	// Pull it token from our cookies and add it to the request body.
	// Only used for modifier commands. Not required for get.
	function addCsrf(body) {
		if (body instanceof FormData) {
			body.append('csrfToken', cookies.get('csrfToken'));
			return body;
		}
		return { ...body, csrfToken: cookies.get('csrfToken') };
	}

	const send = args => (callback) => {
		let req = null;

		switch (args.method) {
			case 'GET':
				req = superagent.get(args.uri).query(args.query);
				break;

			case 'POST':
				req = superagent.post(args.uri).send(addCsrf(args.body));
				break;

			case 'DELETE':
				req = superagent.delete(args.uri).send(addCsrf(args.body));
				break;

			case 'PUT':
				req = superagent.put(args.uri).send(addCsrf(args.body));
				break;

			default:
				break;
		}

		const sendReq = deadline =>
			req
				.timeout({
					// Abort if we don't receive the entire response after this long
					deadline,
				})
				.end((err, resp) => {
					let statusCode = null;
					let body = {};

					if (resp instanceof Object) {
						statusCode = resp.statusCode;
						body = parseJsonDict(resp.text);
					}
					if (err) {
						// Status code=0 if server was unreachable. Timeout for example.
						callback({ body, err, statusCode: intOrDefault(statusCode, 0) });
					} else {
						callback(null, { body, statusCode: intOrDefault(statusCode, 200) });
					}
				});

		// Option may contain a chaos paramter asking us to drop requests spontaneously
		// This is for testing purposes to ensure we can handle turbulent network conditions
		if (options.chaos && Math.random() < options.chaos) {
			callback({
				statusCode: 500,
				body: {},
				err: new Error('Request was cancelled by chaos option'),
			});
			return;
		}

		// Options may contain 'latency' parameter to simular network congestion
		// Use setTimeout to fake a network delay
		const latency = options.latency && (Math.random() * options.latency);

		if (latency && latency >= args.timeout) {
			setTimeout(() => callback({
				statusCode: 0,
				body: {},
				err: new Error('Timeout caused by latency option'),
			}), latency);
		} else if (latency) {
			setTimeout(() => sendReq(args.timeout - latency), latency);
		} else {
			sendReq(args.timeout);
		}
	};

	return {
		send,
	};
};
