/**
 * Created by baishi on 2/29/16.
 */
var supertest = require("supertest");
var should = require("should");
var User = require("../src/models/User");

var server = supertest.agent("http://localhost:4000");

// User Controller Test
describe('User Register Test', function() {
    before(function (done) {
        // delete the user if exists
        User.findOne({
            where: {
                username: 'User4Test'
            }
        }).then(function (user) {
            if (user) {
                User.destroy({
                    where: {
                        id: user.id
                    }
                }).then(function () {
                    done();
                });
            }
            else done();
        });
    });

    // #1 User Register Test

    it("User Register Test", function (done) {

        // calling Register
        server
            .post("/users/User4Test")
            .send({password: '1234', createdAt: 1234, force: true})
            .expect("Content-type", /json/)
            .expect(201, {
                username: 'User4Test'
            })
            .end(function () {
                done();
            });
    }).timeout(5000);

    after(function(done) {
        User.findOne({
            where: {
                username: 'User4Test'
            }
        }).then(function(user) {
            if (user) {
                User.destroy({
                    where: {
                        id: user.id
                    }
                }).then(function() {
                    done();
                })
            }
            else done();
        });
    });
});

describe('User Register Test',function() {
    before(function(done) {
        // create the user if not exists
        User.findOne({
            where: {
                username: 'User4Test'
            }
        }).then(function(user) {
            if (!user) {
                User.create({
                    username: 'User4Test',
                    password: '1234',
                    createdAt: 1234
                }).then(function() {
                    done();
                });
            }
            else done();
        });
    });

    // #2 User Login Test

    it("User Login Test",function(done){

        // calling Login
        server
            .post("/users/User4Test")
            .send({password: '1234', createdAt: 1234, force: true})
            .expect("Content-type",/json/)
            .expect(200, {
                username: 'User4Test'
            })
            .end(function(){
                done();
            });
    }).timeout(5000);

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