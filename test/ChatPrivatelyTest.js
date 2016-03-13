var should = require('should');
var suptertest = require('supertest');

var privatelyMessageController = require('../src/controllers/ChatPrivatelyController');
var User = require('../src/models/User');

var agent = suptertest.agent('http://localhost:3000');


/**
* Test chatPrivately RESTful APIs
*/
describe('Test chatPrivately RESTful APIs: POST /:fromUserName/:toUserName', function(){
    var user1Id;
    var user2Id;
    var userCookie;

    before(function(done){
        privatelyMessageController.Message = require('../src/models/PrivateMessageTest');
        agent.post('/users/UnitTestUser1')
        .send({password: 'unittestpass', createdAt: '10000'})
        .end(function(err, res){
            if(err){
                console.log(err);
                return done(err);
            }
            user1Id = res.body.id;
            agent.post('/users/UnitTestUser2')
            .send({password: 'unittestpass', createdAt: '10001'})
            .end(function(err, res){
                if(err){
                    console.log(err);
                    return done(err);
                }
                user2Id = res.body.id;
                userCookie = res.headers['set-cookie'];
                done();
            });
        });
    });

    it("should return status 422 when request body is not correct", function(done){
        agent.post('/messages/private/UnitTestUser2/UnitTestUser1')
        .set('cookie', userCookie)
        .send({})
        .end(function(err, res){
            res.status.should.equal(422);
            done();
        });
    });

    it("should return status 401 when doesn't use current login user to send a message",
    function(done){
        agent.post('/messages/private/UnitTestUser1/UnitTestUser2')
        .set('cookie', userCookie)
        .send({content: "test message", postedAt: 10000})
        .end(function(err, res){
            res.status.should.equal(401);
            done();
        });

    });

    it("should return status 404 when the toUserName doesn't exist",
    function(done){
        agent.post('/messages/private/UnitTestUser2/UnitTestUser3')
        .set('Cookie', userCookie)
        .send({content: "test message", postedAt: 100001})
        .end(function(err, res){
            res.status.should.equal(404);
            done();
        });
    });

    it("should return status 201 when success",
    function(done){
        agent.post('/messages/private/UnitTestUser2/UnitTestUser1')
        .set('Cookie', userCookie)
        .send({content: "test message", postedAt: 100002})
        .end(function(err, res){
            res.status.should.equal(201);
            res.body.content.should.equal('test message');
            res.body.author.should.equal(user2Id);
            res.body.target.should.equal(user1Id);
            res.body.postedAt.should.equal(100002);
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
        .send({password: 'unittestpass', createdAt: '10000'})
        .end(function(err, res){
            if(err){
                console.log(err);
                return done(err);
            }
            user1Id = res.body.id;
            user1Cookie = res.headers['set-cookie'];

            agent.post('/users/UnitTestUser2')
            .send({password: 'unittestpass', createdAt: '10001'})
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
                    res.body.postedAt.should.equal(100005);

                    agent.post('/users/UnitTestUser1')
                    .send({password: 'unittestpass', createdAt: '10000'})
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
                            res.body.postedAt.should.equal(100006);

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
            res.body[0].postedAt.should.equal(100005);

            res.body[1].content.should.equal('Bye World');
            res.body[1].author.should.equal(user1Id);
            res.body[1].target.should.equal(user2Id);
            res.body[1].postedAt.should.equal(100006);

            done();
        });
    });

    it("should return error status 404 when the receiver doesn't exist",
    function(done){
        agent.post('/users/UnitTestUser2')
        .send({password: 'unittestpass', createdAt: '10001'})
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
