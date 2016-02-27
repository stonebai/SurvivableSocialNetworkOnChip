/**
 * Created by Edison on 2016/2/26.
 */

var dict = {};
var pub = {};

pub.add = function (user, socket) {
    var id = user.id;
    if (dict[id] === undefined) {
        dict[id] = {
            user : user,
            sockets : [socket],
        }
    }
    else {
        dict[id].sockets.push(socket);
    }

    console.log("add a new socket for user " + user.id);
}

pub.remove = function (uid, socket) {
    if(dict[uid]) {
        for(var i = 0; i < dict[uid].sockets.length; i++) {
            if(dict[uid].sockets[i] === socket) {
                dict[uid].sockets.splice(i, 1);
                console.log("remove a socket for user " + uid + " at index " + i);
                break;
            }
        }

        if(dict[uid].sockets.length == 0) {
            delete dict[uid];
        }
    }
}

pub.getUser = function(uid) {
    if(dict[uid]) {
        return dict[uid].user;
    }
    return null;
}

pub.sendTo = function(uid, event, o) {
    if(dict[uid]) {
        for(var i = 0; i < dict[uid].sockets.length; i++) {
            var socket = dict[uid].sockets[i];
            socket.emit(event, o);
        }
    }
}


module.exports = pub;




