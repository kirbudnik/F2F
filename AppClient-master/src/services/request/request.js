const DEFAULT_TIMEOUT = 7500;
const METHODS = ['GET', 'POST', 'PUT', 'DELETE'];


export default (real, mock) => {
	const isValidTimeout = timeout => Number.isInteger(timeout) && timeout > 0;

	function send(reqArgs) {
		return new Promise((resolve, reject) => {
			if (!(reqArgs instanceof Object)) {
				reject('Argument needs to be an object');
				return;
			}

			if (!METHODS.includes(reqArgs.method)) {
				reject('Invalid method');
				return;
			}

			const args = {
				...reqArgs,
				uri: reqArgs.uri || reqArgs.url,
				timeout: isValidTimeout(reqArgs.timeout)
					? reqArgs.timeout
					: DEFAULT_TIMEOUT,
			};

			let func;
			const mockReq = mock.send(args);

			if (mockReq) {
				func = mockReq;
			} else {
				func = real.send(args);
			}

			func((err, resp) => {
				if (err) {
					reject(err);
				} else if (mockReq) {
					// Delay for mock requests
					setTimeout(() => resolve(resp), 1500);
				} else {
					resolve(resp);
				}
			});
		});
	}

	return {
		send,
	};
};
