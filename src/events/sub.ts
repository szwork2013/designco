import client = require("./client");
export = subscribe;

function subscribe(channels: string|string[], callback: (channel: string, message: string) => void) {
	var redisClient = client();

	redisClient.on("ready", () => {
		if (channels instanceof Array)
			channels.forEach(c => redisClient.psubscribe(c));
		else redisClient.psubscribe(channels);
	});

	redisClient.on("subscribe", (channel, count) => {
		global.log.debug("Client successfully subscribed to '" + channel + "' (" + count + ")");
	});

	redisClient.on("message", (channel, message) => {
		callback(channel, message);
	});

	redisClient.on("error", err => {
		global.log.error("[SUB] RedisClient error: " + err);
	});
}

