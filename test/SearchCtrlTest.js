/**
 * Created by Edison on 2016/3/13.
 */
var supertest = require("supertest");
var should = require("should");
var User = require("../src/models/User");
var PublicMessage = require('../src/models/PublicMessage');
var PrivateMessage = require('../src/models/PrivateMessage');
var Announcement = require('../src/models/Announcement');
var agent = supertest.agent('http://localhost:4000');

function isContainKeyContains(s, keywords) {
    var keywords = keywords.split(' ');
    for(var i = 0; i < keywords.length; i++) {
        if(s.indexOf(keywords[i]) < 0) {
            return false;
        }
    }
    return true;
}

describe('Test Search UserName', function(){

    var usernameForTest = "username4test";
    var publicMsgForTest = "public message for search testing";
    var privateMsgForTest = "private message for search testing";
    var annoucementForTest = "announcement for search testing";
    var userId = null;
    var publicMsgId;
    var privateMsgId;
    var annoucementId;

    before(function(done){
        User.create({
            username: usernameForTest,
            password: '1234',
            lastStatusCode: 'YELLOW',
        }).then(function(user){
            userId = user.id;
            PublicMessage.create({
                content: publicMsgForTest,
                author: user.id,
                postedAt: 1000
            }).then(function(publicMsg){
                publicMsgId = publicMsg.id;
                PrivateMessage.create({
                    content: privateMsgForTest,
                    author: user.id,
                    postedAt: 1000
                }).then(function(privateMsg){
                    privateMsgId = privateMsg.id;
                    Announcement.create({
                        author: usernameForTest,
                        content: annoucementForTest,
                        timestamp: 123,
                        location: 'random location',
                    }).then(function(annoucment){
                        annoucementId = annoucment.id;
                        done();
                    })
                });
            });
        });
    });

    after(function(done){
        User.destroy({
            where: {
                username: usernameForTest
            }
        }).then(function(){
            PublicMessage.destroy({
                where: {
                    content: publicMsgForTest,
                }
            }).then(function(){
                PrivateMessage.destroy({
                   where: {
                       content: privateMsgForTest,
                   }
                }).then(function(){
                    Announcement.destroy({
                        where: {
                            content: annoucementForTest
                        }
                    }).then(function(){
                        done();
                    });
                });
            })
        })
    })


    it("should return the users whose names contain keyword", function(done){
        var keyword = "4test";
        var url = '/search/' + keyword + '/UserName/10';

        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;

            // check whether contains the created one.
            var contained = false;
            for(var i = 0; i < results.length; i++) {
                results[i].username.indexOf(keyword).should.not.equal(-1);
                if(results[i].id === userId) {
                    contained = true;
                }
            }
            results.length.should.not.be.above(10);
            contained.should.equal(true);
            done();
        });
    });

    it("should return the users given a specific status code", function(done){
        var statusCode = "YELLOW";
        var url  = '/search/' + statusCode + '/Status/50';

        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;
            var contained = false;

            for(var i = 0; i < results.length; i++) {
                results[i].lastStatusCode.should.equal(statusCode);
                if(results[i].id === userId) {
                    contained = true;
                }
            }
            results.length.should.not.be.above(10);
            contained.should.equal(true);
            done();
        });
    });

    it("should return the announcements given a specific keyword", function(done){
        var keyword = "announcement for search";
        var url = '/search/' + keyword + '/Announcement/50';

        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;

            var contained = false;
            for(var i = 0; i < results.length; i++) {
                //results[i].content.indexOf(keyword).should.not.equal(-1);
                isContainKeyContains(results[i].content, keyword).should.equal(true);
                if(results[i].id === annoucementId) {
                    contained = true;
                }
            }
            results.length.should.not.be.above(10);
            contained.should.equal(true);
            done();
        });
    });


    it("should return the public messages given a specific keyword", function(done){
        var keyword = "public message search testing";
        var url = '/search/' + keyword + '/PublicMessage/10';

        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;
            var contained = false;
            for(var i = 0; i < results.length; i++) {
                //results[i].content.indexOf(keyword).should.not.equal(-1);
                isContainKeyContains(results[i].content, keyword).should.equal(true);
                if(results[i].id === publicMsgId) {
                    contained = true;
                }
            }
            results.length.should.not.be.above(10);
            contained.should.equal(true);
            done();
        });
    });

    it("should return the private messages given a specific keyword", function(done){
        var keyword = "private message for search";
        var url = '/search/' + keyword + '/PrivateMessage/10';

        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;
            var contained = false;
            for(var i = 0; i < results.length; i++) {
                //results[i].content.indexOf('private').should.not.equal(-1);
                isContainKeyContains(results[i].content, keyword).should.equal(true);
                if(results[i].id === privateMsgId) {
                    contained = true;
                }
            }
            results.length.should.not.be.above(10);
            contained.should.equal(true);
            done();
        });
    });

    it("should return 422 when the context is invalid", function(){
        var keyword = 'abc';
        var url = '/search/' + keyword + '/About/10';
        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(422);
        });
    });

    it("should return empty when enters stop words", function(){
        var keyword = "all some";
        var url = '/search/' + keyword + '/PublicMessage/10';
        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;
            results.length.should.equal(0);
        });
    });
});
