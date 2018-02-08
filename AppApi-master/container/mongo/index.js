const { MongoClient, ObjectID: objectId } = require('mongodb');

const INITIAL_WAIT = 500;
const MAX_WAIT = 5000;
const APP_DB_NAME = 'appmongo';
const APP_DB_PORT = 27017;
const url = `mongodb://${APP_DB_NAME}:${APP_DB_PORT}/applogindb`;
const options = {
	// # of times we will try to reconnect before giving up when the connection is lost.
	// If we keep this short then we can fire alerts earlier. Also good to keep short so
	// we can fail fast with api requests. The 'reconnectFailed' event willed be fired
	// which allows us to do a manual reconnect.
	reconnectTries: 2,
	reconnectInterval: 1000,
	// # of requests to buffer while reconnection occurs. All buffered requests will
	// throw errors when we manually reconnect.
	bufferMaxEntries: 100,
	// Below are mongoose specific options
};


module.exports = (logger) => {
	const client = new MongoClient();
	let db = null;
	let wait = INITIAL_WAIT;
	const callbacks = [];

	(function connect() {
		// db = null;
		client.connect(url, options)
			.then((connection) => {
				logger.log('Mongo: Connected');

				wait = INITIAL_WAIT;
				db = connection;

				db.on('close', () => {
					logger.log('Mongo: Closed');
				});

				db.on('reconnect', () => {
					logger.log('Mongo: Reconnected');
				});

				db.s.topology.on('reconnectFailed', () => {
					// Need to manually reconnect if this ever occurs since it means we
					// have stopped trying to reconnect automatically.
					logger.log('Monogo: Reconnect failed. Need to do a manual reconnect.');
					connect();
				});

				callbacks.forEach(cb => cb());
			})
			.catch((err) => {
				logger.error('Mongo: Connect failed', err);
				setTimeout(() => {
					wait = Math.min(wait * 2, MAX_WAIT);
					connect();
				}, wait);
			});
	}());

	return {
		objectId,
		db: () => db,
		onConnect(callback) {
			callbacks.push(callback);
		},
	};
};
