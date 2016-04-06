/**
 * Created by baishi on 4/5/16.
 */
var supertest = require("supertest");
var should = require('should');
var User = require("../src/models/User");
var Room = require("../src/models/Room");
var RoomMessage = require("../src/models/RoomMessage");
var server = supertest.agent("http://localhost:4000");

describe('Test Room Message RESTful APIs: GET /roommessage/:roomname', function () {
    before(function(done) {
        server
            .post("/users/User4Test")
            .send({password:'1234', createdAt:1234, force: true})
            .end(function(err, res) {
                RoomMessage.create({
                    content: 'Content4Test',
                    author: 'User4Test',
                    roomname: 'Room4Test',
                    postedAt: 1234
                }).then(function () {
                    done();
                });
            });
    });

    it('should return status 200 with all messages', function(done) {
        server
            .get('/roommessage/Room4Test')
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                res.body[0].content.should.eql('Content4Test');
                res.body[0].author.should.eql('User4Test');
                res.body[0].roomname.should.eql('Room4Test');
                done();
            });
    });

    it('should return status 200 with no messages', function(done) {
        server
            .get('/roommessage/Room5Test')
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(0);
                done();
            });
    });

    after(function(done) {
        User.destroy({
            where:{
                username: 'User4Test'
            }
        }).then(function() {
            RoomMessage.destroy({
                where: {
                    content: 'Content4Test'
                }
            }).then(function() {
                done();
            });
        });
    });
});