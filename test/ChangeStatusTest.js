var should = require('should');
var suptertest = require('supertest');

var User = require('../src/models/User');

var UserController = require("../src/controllers/UserController");

var agent = suptertest.agent('http://localhost:4000');


/**
* Test changeStatus RESTful APIs
*/
describe('Test changeStatus RESTful APIs: put /current', function() {
    var userId;
    var userCookie;

    before(function(done) {
        UserController.User = require('../src/models/UserTest');
        agent.post('/users/UnitTestUser')
        .send({password: 'unittestpass', createdAt: '10000', force:true})
        .end(function(err, res) {
            if(err) {
                console.log(err);
                return done(err);
            }
            userId = res.body.id;
            userCookie = res.headers['set-cookie'];
            done();
        });
    });

    it("should return status 422 when lastStatus is undefined", function(done) {
        agent.put('/users/current')
        .set('cookie', userCookie)
        .end(function(err, res){
            res.status.should.equal(422);
            done();
        });
    });


    it("should return status 404 when the lastStatusCode is changed fail",
    function(done) {
        agent.put('/users/current')
        .set('Cookie', userCookie)
        .send({lastStatusCode : 'PPPP'})
        .end(function(err, res){
            res.status.should.equal(200);
            done();
        });
    });

    it("should return status 200 when status is changed into YELLO success",
    function(done){
        agent.put('/users/current')
        .set('Cookie', userCookie)
        .send({lastStatusCode : 'YELLO'})
        .end(function(err, res){
            res.status.should.equal(200);
            res.body.lastStatusCode.should.equal("YELLO");
            //res.body.lastStatusCode === 'YELLOW';
            //res.body.lastStatusCode.equal('YELLO');
            done();
        });
    });

    it("should return status 200 when status is changed into GREEN success",
    function(done){
        agent.put('/users/current')
        .set('Cookie', userCookie)
        .send({lastStatusCode : 'GREEN'})
        .end(function(err, res){
            res.status.should.equal(200);
            res.body.lastStatusCode.should.equal("GREEN");
            done();
        });
    });

    it("should return status 200 when status is changed into RED success",
    function(done){
        agent.put('/users/current')
        .set('Cookie', userCookie)
        .send({lastStatusCode : 'RED'})
        .end(function(err, res){
            res.status.should.equal(200);
            res.body.lastStatusCode.should.equal("RED");
            done();
        });
    });
    after(function(done){
    UserController.User = require('../src/models/UserTest');
    User.destroy({
        where: {
            username: 'UnitTestUser'
        }
    }).then(function(){
            done();
        });
    });
});
