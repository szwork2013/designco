import client = require("./client");
import log = require("")
import Promise = require("bluebird");
export = publish;

function publish(event: DesignCo.AppEvent) {
	var redisClient = client();

	redisClient.on("connect", () => {
		var channel = contextToString(event.context) + "/" + typeToString(event.event) + "/" + event.key;
		var message = JSON.stringify(event.data);
		var store = event.context + "/" + event.key;

		redisClient.rpush([store, '"' + message + '"'], (err, res) => {
			if (err) throw "PublishException: Unable to RPUSH: " + err;
			else redisClient.publish(channel, message);
		});
	});

	redisClient.on("error", err => {
		global.log.error("[PUB] RedisClient Error: " + err);
	});
}

function typeToString(eventType: DesignCo.EventType) {
	switch (eventType) {
		case DesignCo.EventType.Create:
			return "create";
		case DesignCo.EventType.Read:
			return "read";
		case DesignCo.EventType.Update:
			return "update";
		case DesignCo.EventType.Delete:
			return "delete";
		case DesignCo.EventType.Notification:
			return "notification";
	}
	throw "InvalidTypeException: Invalid EventType provided";
}

function contextToString(eventContext: DesignCo.EventContext) {
	switch (eventContext) {
		case DesignCo.EventContext.User:
			return "users";
	}
	throw "InvalidContextException: Invalid EventContext provided";
}