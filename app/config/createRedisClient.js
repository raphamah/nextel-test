var redis = require('redis');
var config = require('./config');

function createRedisClient(){
	var client = new redis.createClient(config.redis_port, config.redis_host);
	return client;
}

module.export = function(){
	return createRedisClient;
}
