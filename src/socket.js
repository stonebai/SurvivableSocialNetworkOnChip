var io; // = require('socket.io').listen(server);

exports.io = function() {
    return io;
}
exports.init = function(server) {
    io = require('socket.io').listen(server);
}

exports.emit = function(event, o) {
    io.emit(event, o);
}
