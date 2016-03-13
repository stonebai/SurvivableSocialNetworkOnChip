/**
 * Created by baishi on 3/11/16.
 */
var supertest = require("supertest");
var server = supertest.agent("http://localhost:4000");

describe('Public Chat Controller Test',function() {

    // #1 Session Check Test

    it("Session Check Test",function(done){
        server
            .get("/messages/public")
            .expect("Content-type",/json/)
            .expect(401)
            .end(function(err,res){
                if(err) return done(err);
                else done();
            });
    });
});