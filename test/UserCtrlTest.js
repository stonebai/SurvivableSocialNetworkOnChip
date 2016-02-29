/**
 * Created by baishi on 2/29/16.
 */
var supertest = require("supertest");
var should = require("should");
var User = require("../src/models/user");

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

suite('SAMPLE unit test',function() {

    // #1 User Register Test

    test("User Register Test",function(done){
        // delete the user if exists
        User.findOne({
            where: {
                username: 'Just4Test'
            }
        }).then(function(user) {
            if (user) {
                User.delete(user.id);
            }
        });

        // calling Register
        server
            .post("/users/User4Test")
            .send({password: '1234', createdAt: 1234})
            .expect("Content-type",/json/)
            .expect(201) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(201);
                // Error key should be false.
                res.body.username.should.equal('User4Test');
                User.findOne({
                    where: {
                        username: 'Just4Test'
                    }
                }).then(function(user) {
                    if (user) {
                        User.delete(user.id);
                    }
                });
            });

        // delete the user
        User.findOne({
            where: {
                username: 'Just4Test'
            }
        }).then(function(user) {
            if (user) {
                User.delete(user.id);
            }
        });

        done();
    });

    // #2 User Login Test

    test("User Login Test",function(done){
        // create the user if not exists
        User.findOne({
            where: {
                username: 'Just4Test'
            }
        }).then(function(user) {
            if (!user) {
                User.create({
                    username: 'Just4Test',
                    password: '1234',
                    createdAt: 1234
                });
            }
        });

        // calling Login
        server
            .post("/users/User4Test")
            .send({password: '1234', createdAt: 1234})
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);
                // Error key should be false.
                res.body.username.should.equal('User4Test');
                User.findOne({
                    where: {
                        username: 'Just4Test'
                    }
                }).then(function(user) {
                    if (user) {
                        User.delete(user.id);
                    }
                });
            });

        // delete the user
        User.findOne({
            where: {
                username: 'Just4Test'
            }
        }).then(function(user) {
            if (user) {
                User.delete(user.id);
            }
        });

        done();
    });

    //// #3 Session Control Test
    //test("Session Control Test",function(done){
    //    server
    //        .get("/users")
    //        .expect("Content-type",/json/)
    //        .expect(401) // THis is HTTP response
    //        .end(function(err,res){
    //            // HTTP status should be 401
    //            res.status.should.equal(401);
    //        });
    //});
});
