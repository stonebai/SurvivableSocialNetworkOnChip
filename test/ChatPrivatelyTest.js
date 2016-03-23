var should = require('should');
var supertest = require('supertest');

var privatelyMessageController = require('../src/controllers/ChatPrivatelyController');
var User = require('../src/models/User');

var agent = supertest.agent('http://localhost:4000');


/**
* Test chatPrivately RESTful APIs
*/
describe('Test chatPrivately RESTful APIs: POST /:fromUserName/:toUserName', function(){
    var user1Id;
    var user2Id;
    var userCookie1;
    var userCookie2;

    before(function(done){
        privatelyMessageController.Message = require('../src/models/PrivateMessageTest');
        agent.post('/users/UnitTestUser1')
        .send({password: 'unittestpass', createdAt: '1970-01-01T00:01:40.000Z', force: true})
        .end(function(err, res){
            if(err){
                console.log(err);
                return done(err);
            }
            user1Id = res.body.id;
            agent.post('/users/UnitTestUser2')
            .send({password: 'unittestpass', createdAt: '1970-01-01T00:01:40.001Z', force: true})
            .end(function(err, res){
                if(err){
                    console.log(err);
                    return done(err);
                }
                user2Id = res.body.id;
                user2Cookie = res.headers['set-cookie'];
                done();
            });
        });
    });

    it("should return status 422 when request body is not correct", function(done){
        agent.post('/messages/private/UnitTestUser2/UnitTestUser1')
        .set('cookie', user2Cookie)
        .send({})
        .end(function(err, res){
            res.status.should.equal(422);
            done();
        });
    });

    it("should return status 401 when doesn't use current login user to send a message",
    function(done){
        agent.post('/messages/private/UnitTestUser1/UnitTestUser2')
        .set('cookie', user2Cookie)
        .send({content: "test message", postedAt: "1970-01-01T00:01:40.000Z"})
        .end(function(err, res){
            res.status.should.equal(401);
            done();
        });

    });

    it("should return status 404 when the toUserName doesn't exist",
    function(done){
        agent.post('/messages/private/UnitTestUser2/UnitTestUser3')
        .set('Cookie', user2Cookie)
        .send({content: "test message", postedAt: "1970-01-01T00:01:40.002Z"})
        .end(function(err, res){
            res.status.should.equal(404);
            done();
        });
    });

    it("should return status 201 when success",
    function(done){
        agent.post('/messages/private/UnitTestUser2/UnitTestUser1')
        .set('Cookie', user2Cookie)
        .send({content: "test message", postedAt: 100002})
        .end(function(err, res){
            res.status.should.equal(201);
            res.body.content.should.equal('test message');
            res.body.author.should.equal(user2Id);
            res.body.target.should.equal(user1Id);
            res.body.postedAt.should.equal("1970-01-01T00:01:40.002Z");
            done();
        });
    });

    after(function(done){
        console.log("test after");
        privatelyMessageController.Message = require('../src/models/PrivateMessage');
        User.destroy({
            where: {
                username: 'UnitTestUser1'
            }
        }).then(function(){
            User.destroy({
                where: {
                    username: 'UnitTestUser2'
                }
            }).then(function(){
                done();
            });
        });
    });
});

/**
* Test retrieving all private chat messages between two users
*/
describe('Test retrieving all private chat messages between two users: GET /:userName1/:userName2', function(){
    var user1Id;
    var user2Id;
    var user1Cookie;
    var user2Cookie;

    before(function(done){
        privatelyMessageController.Message = require('../src/models/PrivateMessageTest');
        agent.post('/users/UnitTestUser1')
        .send({password: 'unittestpass', createdAt: 100002, force: true})
        .end(function(err, res){
            if(err){
                console.log(err);
                return done(err);
            }
            user1Id = res.body.id;
            user1Cookie = res.headers['set-cookie'];

            agent.post('/users/UnitTestUser2')
            .send({password: 'unittestpass', createdAt: 100003, force: true})
            .end(function(err, res){
                if(err){
                    console.log(err);
                    return done(err);
                }
                user2Id = res.body.id;
                user2Cookie = res.headers['set-cookie'];

                agent.post('/messages/private/UnitTestUser2/UnitTestUser1')
                .set('Cookie', user2Cookie)
                .send({content: "Hello World", postedAt: 100005})
                .end(function(err, res){
                    res.status.should.equal(201);
                    res.body.content.should.equal('Hello World');
                    res.body.author.should.equal(user2Id);
                    res.body.target.should.equal(user1Id);
                    res.body.postedAt.should.equal("1970-01-01T00:01:40.005Z");

                    agent.post('/users/UnitTestUser1')
                    .send({password: 'unittestpass', createdAt: 100005, force: true})
                    .end(function(err, res){
                        if(err){
                            console.log(err);
                            return done(err);
                        }
                        user1Id = res.body.id;
                        user1Cookie = res.headers['set-cookie'];

                        agent.post('/messages/private/UnitTestUser1/UnitTestUser2')
                        .set('Cookie', user1Cookie)
                        .send({content: "Bye World", postedAt: 100006})
                        .end(function(err, res){
                            res.status.should.equal(201);
                            res.body.content.should.equal('Bye World');
                            res.body.author.should.equal(user1Id);
                            res.body.target.should.equal(user2Id);
                            res.body.postedAt.should.equal("1970-01-01T00:01:40.006Z");

                            done();
                        });
                    });
                });
            });
        });
    });

    it("should return error status 404 when the receiver doesn't exist",
    function(done){
        agent.get('/messages/private/UnitTestUser1/UnitTestUser3')
        .set('Cookie', user1Cookie)
        .end(function(err, res){
            res.status.should.equal(404);
            done();
        });

    });

    it("should return status 200 when the receiver receives the messages successfully",
    function(done){
        agent.get('/messages/private/UnitTestUser2/UnitTestUser1')
        .set('Cookie', user1Cookie)
        .end(function(err, res){
            res.status.should.equal(200);
            res.body.length.should.equal(2);
            res.body[0].content.should.equal('Hello World');
            res.body[0].author.should.equal(user2Id);
            res.body[0].target.should.equal(user1Id);
            res.body[0].postedAt.should.equal("1970-01-01T00:01:40.005Z");

            res.body[1].content.should.equal('Bye World');
            res.body[1].author.should.equal(user1Id);
            res.body[1].target.should.equal(user2Id);
            res.body[1].postedAt.should.equal("1970-01-01T00:01:40.006Z");

            done();
        });
    });

    it("should return error status 404 when the receiver doesn't exist",
    function(done){
        agent.post('/users/UnitTestUser2')
        .send({password: 'unittestpass', createdAt: 100002, force: true})
        .end(function(err, res){
            if(err){
                console.log(err);
                return done(err);
            }
            user2Id = res.body.id;
            user2Cookie = res.headers['set-cookie'];

            agent.get('/messages/private/UnitTestUser2/UnitTestUser3')
            .set('Cookie',user2Cookie)
            .end(function(err, res){
                res.status.should.equal(404);
                done();
            });
        });
    });

    after(function(done){
        privatelyMessageController.Message = require('../src/models/PrivateMessage');
        User.destroy({
            where: {
                username: 'UnitTestUser1'
            }
        }).then(function(){
            User.destroy({
                where: {
                    username: 'UnitTestUser2'
                }
            }).then(function(){
                done();
            });
        });
    });
});
