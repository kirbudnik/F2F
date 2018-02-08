const SESSION_ID_LEN = 24;
const CSRF_LEN = 24;


module.exports = ({ assert, s3, crypto, jwtLib, config, URL }) => {
	const {
		JWT_SECRET_KEY,
		JWT_EXP,
		MIN_USERNAME_LEN,
		MAX_USERNAME_LEN,
		MAX_CHANNEL_NAME_LEN,
		MAX_ABOUT_LEN,
		RESTRICTED_USERNAMES,
		VULGAR_NAMES,
		LOGIN_PLATFORMS,
		OAUTH_STATE_SECRET,
		SIGNUP_TOKEN_EXP,
		SIGNUP_TOKEN_SECRET,
		S3_BUCKET_NAME,
	} = config;

	const wrap = promise => promise
		.then(data => [null, data])
		.catch(err => [err]);

	function randomAlphanumeric(len) {
		const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const setLength = charSet.length;
		let str = '';
		for (let i = 0; i < len; i += 1) {
			str += charSet.charAt(Math.floor(Math.random() * setLength));
		}
		return str;
	}

	// Generate a cryptographically random alphanumeric string of the specified length
	const cryptoRandom = len =>
		crypto.randomBytes(Math.ceil(len * (3 / 4)))
			.toString('base64')
			.slice(0, len)
			.replace(/\+/g, '0')
			.replace(/\//g, '0');

	const isValidUsername = username => (
		typeof username === 'string' &&
		username.length >= MIN_USERNAME_LEN &&
		username.length <= MAX_USERNAME_LEN &&
		(/^[a-zA-Z0-9][-_a-zA-Z0-9]+$/).test(username) &&
		!(RESTRICTED_USERNAMES.includes(username)) &&
		!(VULGAR_NAMES).includes(username)
	);

	const isValidChannelName = name => (
		typeof name === 'string' &&
		name.length > 0 &&
		name.length <= MAX_CHANNEL_NAME_LEN &&
		(/^[-_a-zA-Z0-9]+$/).test(name) &&
		(/^[a-zA-Z0-9]/).test(name) &&
		!(VULGAR_NAMES.includes(name))
	);

	const isValidAboutText = text => (
		typeof text === 'string' &&
		text.length <= MAX_ABOUT_LEN
	);

	function isValidSessionId(id) {
		return typeof id === 'string' && id.length === SESSION_ID_LEN;
	}

	// Simple '-' is used as the userId for all anonymous users
	// The sessionId is used to identify them
	function newAnonUserId() {
		return '-';
	}

	function isAnonUserId(userId) {
		return userId === '-';
	}

	// Return whether string is a supported oauth platform
	function isLoginPlatform(platform) {
		return LOGIN_PLATFORMS.includes(platform);
	}

	// Number of seconds that have pased since the epoch (1970)
	function now() {
		return Math.floor(Date.now() / 1000);
	}

	function newSessionId() {
		return cryptoRandom(SESSION_ID_LEN);
	}

	function newCsrfToken() {
		return cryptoRandom(CSRF_LEN);
	}

	function newCookies(uId, sId) {
		// If the sessionId is valid it should be preserved when logging in/out.
		let userId = uId;
		let sessionId = sId;
		if (uId === null) {
			userId = newAnonUserId();
		}
		if (!isValidSessionId(sessionId)) {
			sessionId = newSessionId();
		}
		const csrfToken = newCsrfToken();
		const seconds = now();
		const jwt = jwtLib.sign({
			userId,
			csrfToken,
			sessionId,
			iat: seconds,
			exp: seconds + JWT_EXP,
		}, JWT_SECRET_KEY);
		return { jwt, csrfToken };
	}

	function inspectTokens(jwt, cookieCsrf) {
		return new Promise((resolve, reject) => {
			if (typeof jwt !== 'string' || typeof cookieCsrf !== 'string') {
				reject('Cookies are not strings');
				return;
			}
			jwtLib.verify(jwt, JWT_SECRET_KEY, (err, decoded) => {
				if (err) {
					reject(err);
					return;
				}
				if (!(decoded instanceof Object)) {
					reject('Decoded token is not an object');
					return;
				}
				const { userId, sessionId, exp, iat, csrfToken: tokenCsrf } = decoded;
				if (
						!userId ||
						!isValidSessionId(sessionId) ||
						!Number.isInteger(iat) ||
						!Number.isInteger(exp) ||
						tokenCsrf !== cookieCsrf) {
					reject('Invalid values inside jwt');
					return;
				}
				resolve({
					userId,
					sessionId,
					exp,
					iat,
					isAuth: !isAnonUserId(userId),
				});
			});
		});
	}

	function newSignupToken(userId, csrfToken) {
		assert(csrfToken, 'Security gap - Csrf not provided for new signup token');
		const seconds = now();
		return jwtLib.sign({
			userId,
			csrfToken,
			iat: seconds,
			exp: seconds + SIGNUP_TOKEN_EXP,
		}, SIGNUP_TOKEN_SECRET);
	}

	function decodeSignupToken(token, cookieCsrf) {
		assert(cookieCsrf, 'Security gap - Csrf not provided to decode signup token');
		return new Promise((resolve, reject) => {
			if (typeof token !== 'string' || typeof cookieCsrf !== 'string') {
				reject('Token not a string');
				return;
			}
			jwtLib.verify(token, SIGNUP_TOKEN_SECRET, (err, decoded) => {
				if (err) {
					reject(err);
					return;
				}
				const { csrfToken } = decoded;
				if (csrfToken !== cookieCsrf) {
					reject('Invalid csrf');
					return;
				}
				resolve(decoded);
			});
		});
	}

	// Return a referral code from a url. First priority is the query parameter
	// ?ref=x. Second priority is the username in the pathname.
	const getRefCodeFromCookies = (cookies) => {
		if (cookies.referralUrl) {
			const url = new URL(cookies.referralUrl);
			const code = url.searchParams.get('ref');
			if (code) {
				return code;
			}
			const path = url.pathname;
			const refPathArr = path.split('/').filter(x => x !== '');
			if (isValidUsername(refPathArr[0])) {
				return refPathArr[0];
			}
		}
		return null;
	};

	const csrfHash = csrfToken =>
		crypto
			.createHmac('sha256', OAUTH_STATE_SECRET)
			.update(csrfToken, 'utf8')
			.digest('hex');


	// FIXME - Fix the pipe once credentials are working
	const dumpToS3 = (path, buffer) =>
		s3
			.putObject({
				Bucket: S3_BUCKET_NAME,
				Key: path,
				Body: buffer,
				ACL: 'public-read',
			})
			.promise();


	const cacheBust = () => `?${randomAlphanumeric(12)}`;


	function imgPath({ userId, channelName, fileName, fileType }) {
		if (channelName) {
			return `users/${userId}/channel/${channelName}/${fileName}.${fileType}`;
		}
		return `users/${userId}/${fileName}.${fileType}`;
	}


	return {
		wrap,
		now,
		isLoginPlatform,
		isValidUsername,
		isValidChannelName,
		isValidAboutText,
		newCookies,
		inspectTokens,
		cacheBust,
		imgPath,
		csrfHash,
		dumpToS3,
		newSignupToken,
		decodeSignupToken,
		getRefCodeFromCookies,
	};
};
