/**
 * Created by Edison on 2016/4/11.
 */
var supertest = require("supertest");
var should = require('should');
var User = require("../src/models/User");
var server = supertest.agent("http://localhost:4000");
var Announcement = require("../src/models/Announcement");
var UserHistory = require('../src/models/UserHistory');

describe('Test Admin RESTful APIs: POST /admin', function(){

    var citizenId = -1;

    // add a citizen
    before(function(done){
        User.create({
            username : 'User4Test',
            password : '1234',
            createdAt: 123,
            privilege: 'Citizen',
        }).then(function(user){
            citizenId = user.id;

            // login the system using the admin account,
            server
                .post("/users/SSNAdmin")
                .send({password: 'admin', createdAt: 1234, force: true})
                .end(function(err,res) {
                    if(err) done(err);
                    else done();
                });
        })
    });

    it('modifiy the basic profile of the citizen', function(done) {

        User.findOne({
            where: {
                id: citizenId,
            }
        }).then(function(user){
            user.username.should.equal('User4Test');
            user.accountStatus.should.equal('ACTIVE');
            user.password.should.equal('1234');
            user.privilege.should.equal('Citizen');

            server
                .post('/admin/' + citizenId)
                .send({
                    username: 'User4Test2',
                    accountStatus: 'INACTIVE',
                    password: '5678',
                    privilege: 'Monitor',
                })
                .end(function(err, res){
                    res.status.should.equal(200);
                    User.findOne({
                        where: {id: citizenId}
                    }).then(function(user){
                        user.username.should.equal('User4Test2');
                        user.accountStatus.should.equal('INACTIVE');
                        user.password.should.equal('5678');
                        user.privilege.should.equal('Monitor');
                        done();
                    });
                });
        });
    }).timeout(5000);

    it("post the invalid password", function(done) {
        User.findOne({
            where: {id: citizenId}
        }).then(function(originalUser){
            server
                .post('/admin/' + citizenId)
                .send({
                    username: 'User4Test',
                    accountStatus: 'INACTIVE',
                    password: '123',
                    privilege: 'Monitor',
                })
                .end(function(err, res){
                    res.status.should.equal(403);
                    User.findOne({
                        where: {id: citizenId}
                    }).then(function(user){
                        user.username.should.equal(originalUser.username);
                        user.accountStatus.should.equal(originalUser.accountStatus);
                        user.password.should.equal(originalUser.password);
                        user.privilege.should.equal(originalUser.privilege);
                        done();
                    });
                });
        });
    });

    it("post invalid privilege, for example: 'visitor'", function(done) {
        User.findOne({
            where: {id: citizenId}
        }).then(function(originalUser){
            server
                .post('/admin/' + citizenId)
                .send({
                    username: 'User4Test',
                    accountStatus: 'INACTIVE',
                    password: '1234',
                    privilege: 'Visitor',
                })
                .end(function(err, res){
                    res.status.should.equal(403);
                    User.findOne({
                        where: {id: citizenId}
                    }).then(function(user){
                        user.username.should.equal(originalUser.username);
                        user.accountStatus.should.equal(originalUser.accountStatus);
                        user.password.should.equal(originalUser.password);
                        user.privilege.should.equal(originalUser.privilege);
                        done();
                    });
                });
        });
    });

    it("post the invalid username", function(done) {
        User.findOne({
            where: {id: citizenId}
        }).then(function(originalUser){
            server
                .post('/admin/' + citizenId)
                .send({
                    username: 'follow',
                    accountStatus: 'INACTIVE',
                    password: '5678',
                    privilege: 'Monitor',
                })
                .end(function(err, res){
                    res.status.should.equal(403);
                    User.findOne({
                        where: {id: citizenId}
                    }).then(function(user){
                        user.username.should.equal(originalUser.username);
                        user.accountStatus.should.equal(originalUser.accountStatus);
                        user.password.should.equal(originalUser.password);
                        user.privilege.should.equal(originalUser.privilege);
                        done();
                    });
                });
        });
    });

    it("Admin has the right to post annoucement", function(done){
        server
            .post('/announcements')
            .send({
                author: 'SSNAdmin',
                content: 'Announcement4TestAdmin',
                timestamp: 123456,
                location: null
            })
            .end(function(err, res){
                res.status.should.equal(201);
                Announcement.findOne({
                    where: {
                        content: 'Announcement4TestAdmin'
                    }
                }).then(function(announcement) {
                    should.exist(announcement);
                    Announcement.destroy({
                        where: {
                            content: 'Announcement4TestAdmin'
                        }
                    }).then(function(){
                        UserHistory.destroy({
                            where: {
                                content: 'Announcement4TestAdmin'
                            }
                        }).then(function(){
                            done();
                        })
                    })
                });
            });
    });

    after(function(done) {
        server
            .delete('/users/logout')
            .end(function(err, res){
                // delete the citizen user.
                User.destroy({
                    where: {
                        id: citizenId,
                    }
                }).then(function(){
                    done();
                });
            });
    });
});

describe('Test Admin RESTful APIs: POST /admin (When no enough privilege)', function(){

    var citizenId = -1;

    // add a citizen, login with this user.
    before(function(done){
        User.create({
            username : 'User4Test',
            password : '1234',
            createdAt: 123,
            privilege: 'Citizen',
        }).then(function(user){
            citizenId = user.id;

            // login the system using the admin account,
            server
                .post("/users/User4Test")
                .send({password: '1234', createdAt: 1234, force: true})
                .end(function(err,res) {
                    if(err) done(err);
                    else done();
                });
        })
    });

    it('modify the profile without enough privilege', function(done) {
        User.findOne({
            where: {id: citizenId}
        }).then(function(originalUser){
            server
                .post('/admin/' + citizenId)
                .send({
                    username: 'Admin4Test',
                    accountStatus: 'INACTIVE',
                    password: '123',
                    privilege: 'Monitor',
                })
                .end(function(err, res){
                    res.status.should.equal(441);
                    User.findOne({
                        where: {id: citizenId}
                    }).then(function(user){
                        user.username.should.equal(originalUser.username);
                        user.accountStatus.should.equal(originalUser.accountStatus);
                        user.password.should.equal(originalUser.password);
                        user.privilege.should.equal(originalUser.privilege);
                        done();
                    });
                });
        });
    });

    after(function(done) {
        server
            .delete('/users/logout')
            .end(function(err, res){
                // delete the citizen user.
                User.destroy({
                    where: {
                        id: citizenId,
                    }
                }).then(function(){
                    done();
                });
            });
    });
});

describe('Test the privilege for Coordinator', function(){
// add a citizen, login with this user.
    var userID;

    before(function(done){
        User.create({
            username : 'Coordinator4Test',
            password : '1234',
            createdAt: 123,
            privilege: 'Coordinator',
        }).then(function(user){
            userID = user.id;
            // login the system using the admin account,
            server
                .post("/users/Coordinator4Test")
                .send({password: '1234', createdAt: 1234, force: true})
                .end(function(err,res) {
                    if(err) done(err);
                    else done();
                });
        })
    });

    it('modify the profile without enough privilege', function(done) {

        User.findOne({
            where: {username : 'Coordinator4Test',}
        }).then(function(originalUser){
            server
                .post('/admin/' + userID)
                .send({
                    username: 'Admin4Test',
                    accountStatus: 'INACTIVE',
                    password: '123',
                    privilege: 'Monitor',
                })
                .end(function(err, res){
                    res.status.should.equal(441);
                    User.findOne({
                        where: {id: userID}
                    }).then(function(user){
                        user.username.should.equal(originalUser.username);
                        user.accountStatus.should.equal(originalUser.accountStatus);
                        user.password.should.equal(originalUser.password);
                        user.privilege.should.equal(originalUser.privilege);
                        done();
                    });
                });
        });
    });

    it("Coordinator has the right to post annoucement", function(done){
        server
            .post('/announcements')
            .send({
                author: 'Coordinator4Test',
                content: 'Announcement4TestCoordinator',
                timestamp: 123456,
                location: null
            })
            .end(function(err, res){
                res.status.should.equal(201);
                Announcement.findOne({
                    where: {
                        content: 'Announcement4TestCoordinator'
                    }
                }).then(function(announcement) {
                    should.exist(announcement);
                    Announcement.destroy({
                        where: {
                            content: 'Announcement4TestCoordinator'
                        }
                    }).then(function(){
                        UserHistory.destroy({
                            where: {
                                content: 'Announcement4TestCoordinator'
                            }
                        }).then(function(){
                            done();
                        })
                    })
                });
            });
    });

    after(function(done) {
        server
            .delete('/users/logout')
            .end(function(err, res){
                // delete the citizen user.
                User.destroy({
                    where: {
                        username : 'Coordinator4Test',
                    }
                }).then(function(){
                    done();
                });
            });
    });
});


describe('Test the privilege for Monitor', function(){
// add a citizen, login with this user.
    var userId;

    before(function(done){
        User.create({
            username : 'Monitor4Test',
            password : '1234',
            createdAt: 123,
            privilege: 'Monitor',
        }).then(function(user){
            userId = user.id;
            // login the system using the admin account,
            server
                .post("/users/Monitor4Test")
                .send({password: '1234', createdAt: 1234, force: true})
                .end(function(err,res) {
                    if(err) done(err);
                    else done();
                });
        })
    });

    it('modify the profile without enough privilege', function(done) {
        User.findOne({
            where: {username : 'Monitor4Test',}
        }).then(function(originalUser){
            server
                .post('/admin/' + userId)
                .send({
                    username: 'Admin4Test',
                    accountStatus: 'INACTIVE',
                    password: '123',
                    privilege: 'Monitor',
                })
                .end(function(err, res){
                    res.status.should.equal(441);
                    User.findOne({
                        where: {id: userId}
                    }).then(function(user){
                        user.username.should.equal(originalUser.username);
                        user.accountStatus.should.equal(originalUser.accountStatus);
                        user.password.should.equal(originalUser.password);
                        user.privilege.should.equal(originalUser.privilege);
                        done();
                    });
                });
        });
    });


    after(function(done) {
        server
            .delete('/users/logout')
            .end(function(err, res){
                // delete the citizen user.
                User.destroy({
                    where: {
                        username : 'Monitor4Test',
                    }
                }).then(function(){
                    done();
                });
            });
    });
});

