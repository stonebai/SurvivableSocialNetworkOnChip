/**
 * Created by baishi on 3/11/16.
 */
var supertest = require("supertest");
var should = require('should');
var User = require("../src/models/User");
var Announcement = require("../src/models/Announcement");
var server = supertest.agent("http://localhost:4000");


/**
 * Session Check Test of Announcement RESTful APIs
 */
describe('Announcement RESTful APIs Session Test',function() {

    // #1 Session Check Test of retrieving announcements

    it("should return 401 when user does not login", function (done) {
        server
            .get("/announcements")
            .expect("Content-type", /json/)
            .expect(401)
            .end(function() {
                done();
            });
    });

    // #2 Session Check Test of posting announcements
    it("should return 401 when user does not login", function (done) {
        server
            .post("/announcements")
            .send({
                author: 'User4Test',
                content: 'Announcement4Test',
                timestamp: new Date(123456),
                location: null
            })
            .expect("Content-type", /json/)
            .expect(401)
            .end(function() {
                done();
            });
    });

});

/**
 * Test Announcement RESTful APIs: GET /announcements
 */
describe('Test Announcement RESTful APIs: GET /announcements', function() {
    before(function(done) {
        User.create({
            username: 'User4Test',
            password: '1234',
            createdAt: 1234
        }).then(function() {
            Announcement.create({
                author: 'User4Test',
                content: 'Announcement4Test',
                timestamp: 123456,
                location: null
            }).then(function() {
                server
                    .post("/users/User4Test")
                    .send({password: '1234', createdAt: 1234, force: true})
                    .end(function() {
                        done();
                    });
            });
        });
    });

    // #3 Get Announcements Test

    it('should return status 200 with all announcements', function(done) {
        server
            .get("/announcements")
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res) {
                res.body.length.should.eql(1);
                res.body[0].author.should.eql('User4Test');
                res.body[0].content.should.eql('Announcement4Test');
                //res.body[0].timestamp.should.eql(new Date(123456));
                done();
            });
    });

    after(function(done) {
        server
            .delete("/users/logout")
            .end(function() {
                Announcement.destroy({
                    where: {
                        content: 'Announcement4Test'
                    }
                }).then(function() {
                    User.destroy({
                        where: {
                            username: 'User4Test'
                        }
                    }).then(function() {
                        done();
                    });
                })
            });
    });
});

/**
 * Test Announcement RESTful APIs: POST /announcements
 */
describe('Test Announcement RESTful APIs: POST /announcements', function() {
    before(function (done) {
        server
            .post("/users/User4Test")
            .send(({password: '1234', createdAt: 1234, force: true}))
            .end(function() {
                done();
            });
    });

    it('should return 441 when no privilage', function (done) {
        server
            .post("/announcements")
            .send({
                author: 'User4Test',
                content: 'Announcement4Test',
                timestamp: 123456,
                location: null
            })
            .expect(441)
            .end(function () {
                Announcement.findOne({
                    where: {
                        content: 'Announcement4Test'
                    }
                }).then(function (announcement) {
                    should.not.exist(announcement);
                    done();
                });
            });
    });

    after(function(done) {
        server
            .delete("/users/logout")
            .end(function() {
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

describe('Test Announcement RESTful APIs: POST /announcements', function() {
    before(function(done) {
        server
            .post("/users/SSNAdmin")
            .send({password: 'admin', createdAt: 1234})
            .end(function() {
                done();
            });
    });

    // #4 Post Announcements Test

    it('should return status 201 when success', function(done) {
        server
            .post("/announcements")
            .send({
                author: 'SSNAdmin',
                content: 'Announcement4Test',
                timestamp: 123456,
                location: null
            })
            .expect(201)
            .end(function() {
                Announcement.findOne({
                    where: {
                        content: 'Announcement4Test'
                    }
                }).then(function(announcement) {
                    should.exist(announcement);
                    announcement.author.should.eql('SSNAdmin');
                    announcement.timestamp.should.eql(new Date(123456));
                    done();
                });
            });
    });

    after(function(done) {
        server
            .delete("/users/logout")
            .end(function() {
                Announcement.destroy({
                    where: {
                        content: 'Announcement4Test'
                    }
                }).then(function() {
                    done();
                });
            });
    });
});
