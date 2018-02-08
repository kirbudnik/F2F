/* eslint import/no-extraneous-dependencies: off, no-console: off */
const assert = require('assert');
const dotenv = require('dotenv');
const _ = require('underscore');

const env = Object.keys(dotenv.config({ path: '.env' }).parsed);
const exampleEnv = Object.keys(dotenv.config({ path: '.env.example' }).parsed);

const dif = _.difference(env, exampleEnv);
const exampleDif = _.difference(exampleEnv, env);

assert(dif.length === 0, `.env.example file missing keys ${dif}`);
assert(exampleDif.length === 0, `.env file missing keys ${exampleDif} from example`);

console.log('.env and .env.example keys match');
