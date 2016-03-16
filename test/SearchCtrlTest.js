/**
 * Created by Edison on 2016/3/13.
 */
var supertest = require("supertest");
var should = require("should");
var User = require("../src/models/User");
var SearchController = require('../src/controllers/SearchController');
var agent = supertest.agent('http://localhost:4000');

describe('Test Search UserName', function(){

    it("should return the users whose names contain keyword", function(done){
        var keyword = "abc";
        var url = '/search/' + keyword + '/UserName/10';

        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;
            for(var i = 0; i < results.length; i++) {
                results[i].username.indexOf(keyword).should.not.equal(-1);
            }
            results.length.should.not.be.above(10);
            done();
        });
    });

    it("should return the users given a specific status code", function(done){
        var statusCode = "GREEN";
        var url  = '/search/' + statusCode + '/Status/10'

        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;
            for(var i = 0; i < results.length; i++) {
                results[i].lastStatusCode.should.equal(statusCode);
            }
            results.length.should.not.be.above(10);
            done();
        });
    });

    it("should return the announcements given a specific keyword", function(done){
        var keyword = "Hello";
        var url = '/search/' + keyword + '/Announcement/10';

        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;
            for(var i = 0; i < results.length; i++) {
                results[i].content.indexOf(keyword).should.not.equal(-1);
            }
            results.length.should.not.be.above(10);
            done();
        });
    });


    it("should return the public messages given a specific keyword", function(done){
        var keyword = "a";
        var url = '/search/' + keyword + '/PublicMessage/10';

        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;
            for(var i = 0; i < results.length; i++) {
                results[i].content.indexOf(keyword).should.not.equal(-1);
            }
            results.length.should.not.be.above(10);
            done();
        });
    });

    it("should return the private messages given a specific keyword", function(done){
        var keyword = "abc";
        var url = '/search/' + keyword + '/PrivateMessage/10';

        agent.get(url).send({}).end(function(err, res){
            res.status.should.equal(200);
            var results = res.body;
            for(var i = 0; i < results.length; i++) {
                results[i].content.indexOf(keyword).should.not.equal(-1);
            }
            results.length.should.not.be.above(10);
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
