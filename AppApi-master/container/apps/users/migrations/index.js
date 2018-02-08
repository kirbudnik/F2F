const joi = require('joi');
const _ = require('lodash');
const { ObjectID: objectId } = require('mongodb');
const Vers = require('vers');
const V1 = require('./users.v1');
const V2 = require('./users.v2');
const V3 = require('./users.v3');
const V4 = require('./users.v4');
const V5 = require('./users.v5');


// Define joi utilities
const now = joi.number().integer().default(() => Math.floor(new Date() / 1000), 'Now');
const optionalString = joi.string().allow('', null);
const objectIdType = joi.object().type(objectId);
const arrayOfUniqueObjectIds = joi.array().items(objectIdType).unique((a, b) => a.equals(b));
const defaultFalse = joi.boolean().default(false);
const defaultTrue = joi.boolean().default(true);

const utils = {
	now,
	optionalString,
	objectIdType,
	arrayOfUniqueObjectIds,
	defaultFalse,
	defaultTrue,
};


// Define versioning
const userVers = new Vers();
let curVersion = 1;
const versions = {};


function addVer(version, ver) {
	if (version > 1) {
		userVers.addConverter(version - 1, version, ver.forwards, ver.backwards);
	}
	versions[version] = ver;
	curVersion = version;
}


// Add migrations
const v1 = V1({ joi, utils });
addVer(1, v1);

const v2 = V2({ _, joi, utils, prevVer: v1 });
addVer(2, v2);

const v3 = V3({ _, joi, utils, prevVer: v2 });
addVer(3, v3);

const v4 = V4({ _, joi, utils, prevVer: v3 });
addVer(4, v4);

const v5 = V5({ joi, utils, prevVer: v4 });
addVer(5, v5);


// Exposed method
function fromTo(fromV, toVer, obj) {
	// 'from' will be > 'to' if another instance is running migrations while this
	// instance is still running old code. The code needs to be written to handle
	// this. We should just compare to current instance and not strip new keys.
	const fromVer = fromV > curVersion ? curVersion : fromV;

	if (fromVer === toVer) {
		// No migration is needed. Just validate the value.
		return versions[fromVer].validate(obj);
	}
	// Validate the current version. Then perform migration.
	return versions[fromVer].validate(obj)
		.then(o => userVers.fromTo(fromVer, toVer, o));
}


module.exports = {
	curVersion,
	fromTo,
};
