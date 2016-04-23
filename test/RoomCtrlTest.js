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
        server
            .post("/users/User4Test")
            .send({password:'1234', createdAt:1234, force: true})
            .end(function() {
                Room.create({
                    roomname: 'Room4Test',
                    creatorname: 'User4Test'
                }).then(function() {
                    done();
                });
            });
    });

    it('should return status 200 with all rooms', function(done) {
        server
            .get("/room/rooms/User4Test")
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res) {
                res.body.length.should.eql(1);
                res.body[0].roomname.should.eql('Room4Test');
                res.body[0].creatorname.should.eql('User4Test');
                done();
            });
    }).timeout(5000);

    it('should return status 200 with no rooms', function(done) {
        server
            .get("/room/rooms/User5Test")
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res) {
                res.body.length.should.eql(0);
                done();
            });
    }).timeout(5000);

    after(function(done) {
        Room.destroy({
            where:{
                roomname: 'Room4Test',
                creatorname: 'User4Test'
            }
        }).then(function() {
            User.destroy({
                where: {
                    username: 'User4Test'
                }
            }).then(function() {
                done();
            });
        });
    });
});

describe('Test Room RESTful APIs: GET /room/:roomname', function() {
    before(function(done) {
        server
            .post("/users/User4Test")
            .send({password:'1234', createdAt:1234, force: true})
            .end(function() {
                Room.create({
                    roomname: 'Room4Test',
                    creatorname: 'User4Test'
                }).then(function() {
                    done();
                });
            });
    });

    it('should return status 200 with a room', function(done) {
        server
            .get("/room/Room4Test")
            .expect("Content-type",/json/)
            .expect(200)
            .end(function (err, res) {
                res.body.roomname.should.eql('Room4Test');
                res.body.creatorname.should.eql('User4Test');
                done();
            });
    });

    it('should return status 200 with no room', function(done) {
        server
            .get("/room/Room5Test")
            .expect("Content-type",/json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(res.body);
                done();
            });
    });

    after(function(done) {
        Room.destroy({
            where:{
                roomname: 'Room4Test',
                creatorname: 'User4Test'
            }
        }).then(function() {
            User.destroy({
                where: {
                    username: 'User4Test'
                }
            }).then(function() {
                done();
            });
        });
    });
});

describe('Test Room RESTful APIs: POST /room', function() {
    before(function(done) {
        server
            .post("/users/User4Test")
            .send({password:'1234', createdAt:1234, force: true})
            .end(function() {
                done();
            });
    });

    it('should return status 400 with nothing', function(done) {
        server
            .post("/room")
            .send({
                roomname: '   \t \n  ',
                creatorname: 'User4Test'
            })
            .expect("Content-type",/json/)
            .expect(400)
            .end(function() {
                done();
            });
    });

    it('should return status 200 with created room', function(done) {
        server
            .post("/room")
            .send({
                roomname: 'Room4Test',
                creatorname: 'User4Test'
            })
            .expect("Content-type",/json/)
            .expect(201)
            .end(function(err, res) {
                res.body.roomname.should.eql('Room4Test');
                res.body.creatorname.should.eql('User4Test');
                done();
            });
    });

    it('should return status 409 with nothing', function(done) {
        server
            .post("/room")
            .send({
                roomname: 'Room4Test',
                creatorname: 'User4Test'
            })
            .expect("Content-type",/json/)
            .expect(409)
            .end(function() {
                done();
            });
    });

    after(function(done) {
        Room.destroy({
            where:{
                roomname: 'Room4Test',
                creatorname: 'User4Test'
            }
        }).then(function() {
            User.destroy({
                where: {
                    username: 'User4Test'
                }
            }).then(function() {
                done();
            });
        });
    });
});

describe('Test Room RESTful APIs: PUT /room', function() {
    before(function(done) {
        server
            .post("/users/User4Test")
            .send({password:'1234', createdAt:1234, force: true})
            .end(function() {
                Room.create({
                    roomname: 'Room4Test',
                    creatorname: 'User4Test'
                }).then(function() {
                    done();
                });
            });
    });

    it('should return 200 with nothing', function(done) {
        server
            .put("/room")
            .send({
                roomname: 'Room4Test',
                creatorname: 'User4Test'
            })
            .expect("Content-type",/json/)
            .expect(200)
            .end(function () {
                Room.findOne({
                    where:{
                        roomname: 'Room4Test'
                    }
                }).then(function(room) {
                    should.not.exist(room);
                    done();
                });
            });
    });

    it('should return 200 with no room', function(done) {
        server
            .get("/room/Room4Test")
            .expect("Content-type",/json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(res.body);
                done();
            });
    });

    after(function(done) {
        Room.destroy({
            where:{
                roomname: 'Room4Test',
                creatorname: 'User4Test'
            }
        }).then(function() {
            User.destroy({
                where: {
                    username: 'User4Test'
                }
            }).then(function() {
                done();
            });
        });
    });
});