/**
 * Created by baishi on 4/20/16.
 */
var socket = require('../src/socket');

describe('test io', function() {
    it('normal test', function(done) {
        socket.io();
        done();
    });
});

describe('test init', function() {
    it('normal test', function(done) {
        socket.init({});
        done();
    }).timeout(5000);
});

describe('test emit', function() {
    it('normal test', function(done) {
        socket.emit({}, {});
        done();
    });
});