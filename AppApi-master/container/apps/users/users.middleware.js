module.exports = ({ Busboy, sharp, model, helpers, config, logger }) => {
	const { JWT_COOKIE_SETTINGS, CSRF_COOKIE_SETTINGS } = config;
	const { wrap, now, inspectTokens, newCookies } = helpers;

	// Inspect tokens and populate req.user, req.sessionId and req.hasValidCookies
	async function authCookies(req, res, next) {
		const { jwt, csrfToken } = req.cookies;
		let err;
		let decoded;
		let user;

		[err, decoded] = await wrap(inspectTokens(jwt, csrfToken));
		if (err) {
			req.hasValidCookies = false;
			req.sessionId = null;
		} else {
			req.hasValidCookies = true;
			req.sessionId = decoded.sessionId;
		}

		if (decoded && decoded.isAuth) {
			[err, user] = await wrap(model.findById(decoded.userId));
			if (err) {
				logger.error('Middleware get user', err);
				res.sendStatus(500);
				return;
			}
		}

		req.isAuth = Boolean(user);
		req.user = user || {};

		// Add a convenience method to logout from anywhere
		req.logout = () => {
			const { jwt: newJwt, csrfToken: newCsrf } = newCookies(null, req.sessionId);

			res.cookie('jwt', newJwt, JWT_COOKIE_SETTINGS);
			res.cookie('csrfToken', newCsrf, CSRF_COOKIE_SETTINGS);
		};

		// Add a convenience method to login from anywhere. User must have a username
		// in order to log in
		req.login = (userObj) => {
			if (userObj.username) {
				const { jwt: newJwt, csrfToken: newCsrf } = newCookies(userObj._id, req.sessionId);

				res.cookie('jwt', newJwt, JWT_COOKIE_SETTINGS);
				res.cookie('csrfToken', newCsrf, CSRF_COOKIE_SETTINGS);
			}
		};

		// Give the user anonymous tokens if they are invalid
		if (!req.hasValidCookies) {
			req.logout();
		}

		// Continually refresh valid tokens. Preserves sessionId and prevents
		// tokens from expiring in the middle of site use. Also allows authenticated
		// users to stay permanently logged in
		if (decoded && now() - decoded.iat > (24 * 60 * 60)) {
			if (req.isAuth) {
				req.login(req.user);
			} else {
				req.logout();
			}
		}

		next();
	}

	// Used to secure form posts by preventing csrf attacks. Extra csrf token is
	// passed in the request body. Ensure this token matches the cookie token
	function csrfDefend(req, res, next) {
		if ((['POST', 'PUT', 'DELETE']).includes(req.method)) {
			if (
					req.hasValidCookies &&
					req.body instanceof Object &&
					req.body.csrfToken === req.cookies.csrfToken) {
				next();
			} else {
				res.sendStatus(403);
			}
		} else {
			next();
		}
	}

	// Don't allow requests with invalid jwt or csrf tokens
	function hasValidCookies(req, res, next) {
		if (req.hasValidCookies) {
			next();
		} else {
			res.sendStatus(401);
		}
	}

	// User must be logged in. User must also have a username. A user can
	// be logged in without a username when first signing up. This will deny
	// those users.
	function isAuth(req, res, next) {
		if (req.isAuth && req.user.username) {
			next();
		} else {
			res.sendStatus(401);
		}
	}

	// Same as above except the user doesn't need to have a username.
	function hasAuthCookies(req, res, next) {
		if (req.isAuth) {
			next();
		} else {
			res.sendStatus(401);
		}
	}

	// User must be logged out. Does not ensure cookies are valid
	function isAnon(req, res, next) {
		if (req.isAuth) {
			return res.sendStatus(401);
		}
		return next();
	}

	// Ensure the 'username' query param matches us
	function isSelf(req, res, next) {
		if (
				req.isAuth &&
				req.user.lowercaseUsername &&
				req.user.lowercaseUsername === req.params.username.toLowerCase()) {
			next();
		} else {
			res.sendStatus(401);
		}
	}

	function channelExists(req, res, next) {
		if (model.getChannel(req.user, req.params.channelName)) {
			next();
		} else {
			res.sendStatus(404);
		}
	}

	function multipartFormParser(req, res, next) {
		const contentType = req.headers['content-type'] || '';

		// No action if this is not a multipart message
		if (contentType.indexOf('multipart/form-data') === -1) {
			next();
			return;
		}

		const busboy = new Busboy({
			headers: req.headers,
			highWaterMark: 3 * 1024 * 1024,
			limits: {
				files: 1,
				fileSize: 20 * 1024 * 1024,
			},
		});

		// Call next when we are done
		busboy.on('finish', () => {
			next();
		});

		// Create a req.body object from the text fields
		busboy.on('field', (key, val) => {
			req.body[key] = val;
		});

		// Add file to req.file object. Only fires if there is a file in the request
		busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
			if (!(/^image\/(jpg|jpeg|png|gif)/).test(mimeType)) {
				logger.log('Invalid image type', mimeType);
				res.sendStatus(400);
				return;
			}

			const buffer = [];

			file.on('data', data => buffer.push(data));
			file.on('error', (err) => {
				logger.error('Busboy file upload', err);
				res.sendStatus(500);
			});
			file.on('end', () => {
				req.file = {
					fieldName,
					fileName,
					encoding,
					mimeType,
					buffer,
				};
			});
		});

		req.pipe(busboy);
	}


	const uploadImage = (width, height) => (req, res, next) => {
		if (!(req.file instanceof Object)) {
			logger.log('Upload image - file not attached to req object');
			res.sendStatus(400);
			return;
		}

		const image = sharp(Buffer.concat(req.file.buffer));

		image.metadata()
			.then(meta => image
				.resize(Math.round(width || meta.width), Math.round(height || meta.height))
				.crop()
				.withoutEnlargement()
				.jpeg({ quality: 90, force: true })
				.toBuffer(),
			)
			.then((buffer) => {
				req.image = { buffer, type: 'jpeg' };
				next();
			})
			.catch((err) => {
				logger.error('Upload image', err);
				res.sendStatus(500);
			});
	};


	return {
		authCookies,
		csrfDefend,
		hasValidCookies,
		isAuth,
		hasAuthCookies,
		isAnon,
		isSelf,
		channelExists,
		multipartFormParser,
		uploadImage,
	};
};
