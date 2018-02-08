const redisDb = require('redisdb');

module.exports = logger =>
	redisDb.connect(6379, 'appredis', (err) => {
		logger.error('Redis db', err);
		process.exit(1);
	});
