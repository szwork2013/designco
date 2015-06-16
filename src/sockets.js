var server = require("./server");
var io = require("socket.io");
var events = require("ls-events");
var log = require("ls-logger");
var cfg = require("ls-config");
// Events API listener
server.connection({
    port: cfg.config("eventsPort"),
    labels: "events"
});
// Socket.IO listener
var ioServer = io(server.select("events").listener);
ioServer.on("connection", socketHandler);
function socketHandler(socket) {
    log.info("[CONNECTED] " + socket.id);
    socket.on("subscribe", function (msg) {
        log.info("[SOCKET:SUB] " + socket.id + ": " + msg);
        var options = JSON.parse(msg);
        // Subscribe the socket to the requested channel
        events.psub(options.channel, function (ch, pt, msg) {
            socket.emit(ch, pt);
        });
    });
}
module.exports = ioServer;