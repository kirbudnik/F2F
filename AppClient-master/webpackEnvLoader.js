const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const git = require('git-rev-sync');


// Helper - Return every value that is only in one of two arrays
function difference(arrA, arrB) {
	const dif1 = arrA.filter(val => arrB.indexOf(val) === -1);
	const dif2 = arrB.filter(val => arrA.indexOf(val) === -1);
	return dif1.concat(dif2);
}

// Helper - Remove all null values from a dictionary
function removeNulls(obj) {
	const result = {};
	Object.keys(obj).forEach((key) => {
		if (obj[key] !== null) {
			result[key] = obj[key];
		}
	});
	return result;
}


// Load for dev
function loadLocalEnvVars() {
	// Attempt to load the env file
	let vars;
	try {
		vars = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '.env')));
	} catch (e) {
		throw new Error('A .env file must be present in your project working directory');
	}

	// Compare keys in .env file to .env.example file to ensure they stay consistent
	let exampleVars;
	try {
		exampleVars = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '.env.example')));
	} catch (err) {
		throw new Error('An .env.example must be present in your project working directory');
	}

	// Throw an error if example.env and .env have different keys
	const difKeys = difference(Object.keys(exampleVars), Object.keys(removeNulls(vars)));
	if (difKeys.length > 0) {
		throw new Error(`.env and .env.example do not match. Different keys: ${difKeys.join(', ')}`);
	}

	return Object.assign({}, vars, {
		CODE_SHA: git.long(),
	});
}


// Load for prod/staging
function loadCiEnvVars(environment) {
	const vars = process.env;

	// CirclCI has environment variables for both production and staging.
	// So, FOO will be defined as FOO_PRODUCTION and FOO_STAGING.
	// We have to load the appropriate environment variant into FOO.
	const VARIANTS = [
		'GA_TRACKING_ID',
		'FACEBOOK_CLIENT_ID',
		'STRIPE_PUBLIC_KEY',
	];

	VARIANTS.forEach((key) => {
		vars[key] = process.env[`${key}_${environment.toUpperCase()}`];
	});

	return Object.assign({}, vars, {
		CODE_SHA: process.env.CIRCLE_SHA1,
	});
}


// A dev build will contain a local .env file with the appropriate config.
// A CI build will need to parse the store environment and filter out the
// variables that correspond to the build (deploy prod/staging, CI build).
module.exports = (environment) => {
	if (environment === 'development') {
		return loadLocalEnvVars();
	}
	return loadCiEnvVars(environment);
};
