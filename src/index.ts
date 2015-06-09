import dbInit = require("./store/init");
import path = require("path");
import hapi = require("hapi");
import log = require("./logger");
import pub = require("./events/pub");
import sub = require("./events/sub");
import psub = require("./events/patternSub");

var basePath = path.resolve(__dirname, "..");
var liveDb = path.join(basePath, "designco.db");
var baseDb = path.join(basePath, "designco-base.sqlite");

global.sub = sub;
global.pub = pub;
global.psub = psub;
global.log = log;
global.config = {
    port: 45199,
    redisHost: "192.168.59.103",
    liveDatabase: liveDb,
    baseDatabase: baseDb
}

dbInit();

//TODO: Put port in config
var port = global.config.port || 45199;
var server = new hapi.Server();

server.connection({
    port: port
});

server.start(() => {
    log.info("Starting server on port " + global.config.port);
});

psub("users.create.*", (channel, pattern, message) => {
    log.info("Message received: [" + channel + "] " + pattern + " -- " + message);
});

setTimeout(() => {

    var event = {
        event: DesignCo.EventType.Create,
        context: DesignCo.EventContext.User,
        key: "c.winkler",
        data: {
            username: "c.winkler",
            email: "carl@winkler.id.au",
            enabled: 1,
            company: "longshot"
        }
    };
    pub(event);
    log.warn("Published message");
}, 1000);

log.warn("Completed synchronous functions");