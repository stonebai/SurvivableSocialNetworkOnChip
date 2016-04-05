/**
 * Created by baishi on 4/4/16.
 */
var supertest = require("supertest");
var should = require('should');
var User = require("../src/models/User");
var Room = require("../src/models/Room");
var server = supertest.agent("http://localhost:4000");

describe('Test Room RESTful APIs: GET /room/rooms/:username', function() {
    before(function(done) {
        Room.create({
            roomname: 'Room4Test',
            username: 'User4Test'
        }).then(function() {
            server
                .post("/users/User4Test")
                .send({password:'1234', createdAt:1234})
                .end(function(err, res) {
                    if(err) done(err);
                    else done();
                });
        });
    });
});