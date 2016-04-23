var should = require('should');
var supertest = require('supertest');

var User = require('../src/models/User');

var testMessage = require('../src/models/PublicMessage');

var agent = supertest.agent('http://localhost:4000');

/**
* Test chatPublicly RESTful APIs
*/
describe('Test chat publicly RESTful APIs: POST /:fromUserName', function(){
    var userCookie;

    var userId;

    before(function(done){
        agent.post('/users/UnitTestUser')
        .send({password: 'unittestpass', createdAt: 100002, force: true})
        .end(function(err, res){
            userId = res.body.id;
            userCookie = res.headers['set-cookie'];
            done();
        });
    });

    it("should return status 422 when request body is not correct", function(done){
        agent.post('/messages/public/UnitTestUser')
        .set('cookie', userCookie)
        .send({})
        .end(function(err, res){
            res.status.should.equal(422);

            testMessage.findOne({
                where: {
                    author: userId
                }
            }).then(function(message){
                should.not.exist(message);
                done();
            });
        });
    });

    it("should return status 401 when doesn't use current login user to send a message",
    function(done){
        agent.post('/messages/public/UnitTestUser2')
        .set('cookie', userCookie)
        .send({content: "test message", postedAt: 100002})
        .end(function(err, res){
            res.status.should.equal(401);

            testMessage.findOne({
                where: {
                    author: userId
                }
            }).then(function(message){
                should.not.exist(message);
                done();
            });
        });

    });

    it("should return status 201 when success",
    function(done){
        agent.post('/messages/public/UnitTestUser')
        .set('Cookie', userCookie)
        .send({content: "test message", postedAt: 100003})
        .end(function(err, res){
            res.status.should.equal(201);
            res.body.content.should.equal('test message');
            res.body.author.should.equal(userId);
            res.body.postedAt.should.equal("1970-01-01T00:01:40.003Z");

            testMessage.findOne({
                where: {
                    author: userId
                }
            }).then(function(message){
                should.exist(message);
                message.content.should.equal("test message");
                message.author.should.equal(userId);
                done();
            });

        });
    });

    after(function(done){
        console.log("test after");
        User.destroy({
            where: {
                username: 'UnitTestUser'
            }
        }).then(function(){
            testMessage.destroy({
                where: {}
            }).then(function() {
                done();
            });
        });
    });
});



/**
* Test retrieving all public chat messages
*/
describe('Test retrieving all public chat messages: GET /:', function(){
    var userId;
    var userCookie;

    before(function(done){
        agent.post('/users/UnitTestUser')
        .send({password: 'unittestpass', createdAt: 100002, force: true})
        .end(function(err, res){
            userId = res.body.id;
            userCookie = res.headers['set-cookie'];

            agent.post('/messages/public/UnitTestUser')
            .set('Cookie', userCookie)
            .send({content: "Hello World", postedAt: 100005})
            .end(function(err, res){
                res.status.should.equal(201);
                res.body.content.should.equal('Hello World');
                res.body.author.should.equal(userId);
                res.body.postedAt.should.equal("1970-01-01T00:01:40.005Z");

                done();
            });
        });
    });


    it("should return status 200 when the receiver receives the messages successfully",
    function(done){
        agent.get('/messages/public')
        .set('Cookie', userCookie)
        .end(function(err, res){
            res.status.should.equal(200);
            res.body.length.should.equal(1);
            res.body[0].content.should.equal('Hello World');
            res.body[0].author.should.equal(userId);
            res.body[0].postedAt.should.equal("1970-01-01T00:01:40.005Z");

            done();
        });
    });

    after(function(done){
        console.log("test after");
        User.destroy({
            where: {
                username: 'UnitTestUser'
            }
        }).then(function(){
            testMessage.destroy({
                where: {}
            }).then(function() {
                done();
            });
        });
    });
});
