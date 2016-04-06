var should = require('should');
var supertest = require('supertest');

var agent = supertest.agent('http://localhost:4000');

var RequestRecord = require('../src/utils/RequestRecord');

describe('Test Request record', function(){
    var count = {};

    before(function(done){
        var stat = RequestRecord.retrieve();
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var date = year + "-" + month + "-" + day;

        count["/users"]= stat[date]["/users"];
        count["/announcements"] = stat[date]["/announcements"];

        done();
    });

    it("should record a record in the stat file for /users, and the count increases 1", function(done){
        agent.get('/users').end(function(err, res){
            var stat = RequestRecord.retrieve();
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var date = year + "-" + month + "-" + day;

            stat[date]["/users"].should.equal(count["/users"] + 1);
            done();
        });
    });

    it("should record a record in the stat file for /announcements, and the count increases 1", function(done){
        agent.get('/announcements').end(function(err, res){
            var stat = RequestRecord.retrieve();
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var date = year + "-" + month + "-" + day;

            stat[date]["/announcements"].should.equal(count["/announcements"] + 1);
            done();
        });
    });
});
