/**
 * Created by baishi on 4/20/16.
 */
var UserDict = require('../src/UserDict');

describe('test add function', function() {
    it('if not exist',function(done) {
        var user = {};
        user.id = 1;
        var socket = {};
        UserDict.add(user, socket);
        done();
    });

    it('if already exist', function(done) {
        var user = {};
        user.id = 1;
        var socket = {};
        UserDict.add(user, socket);
        UserDict.add(user, socket);
        done();
    });
});


describe('test remove function', function() {
    it('if exist one',function(done) {
        var user = {};
        user.id = 2;
        var socket = {};
        UserDict.add(user, socket);
        UserDict.remove(2, socket);
        done();
    });

    it('if exist more', function(done) {
        var user = {};
        user.id = 2;
        var socket = {};
        UserDict.add(user, socket);
        UserDict.add(user, socket);
        UserDict.remove(2, socket);
        done();
    });
});

describe('test get user function', function() {
    it('if not exist',function(done) {
        UserDict.getUser(3);
        done();
    });

    it('if exist more', function(done) {
        var user = {};
        user.id = 3;
        var socket = {};
        UserDict.add(user, socket);
        UserDict.getUser(3);
        done();
    });
});

describe('test send to function', function() {
    it('if not exist',function(done) {
        var user = {};
        user.id = 4;
        var socket = {};
        socket.emit = function(event, o) {
            o();
        };
        UserDict.add(user, socket);
        UserDict.sendTo(4, {}, done);
    });
});

describe('test is online function', function() {
    it('if not exist', function(done) {
        UserDict.isOnline(5);
        done();
    });

    it('if exist', function(done) {
        var user = {};
        user.id = 5;
        var socket = {};
        UserDict.add(user, socket);
        UserDict.isOnline(5);
        done();
    });
});
