/**
 * Created by baishi on 2/24/16.
 */
var should = require('should');
var User = require('../src/models/UserTest');

describe('User Model Tests', function() {
    /**
     * Test if it can create a new user in database.
     */
    it('Create a New User', function(done) {
        User.findOne({
            where: {
                username: 'Just4Test'
            }
        }).then(function(user) {
            if (!user) {
                User.create({
                    username: 'Just4Test',
                    password: '1234',
                    createdAt: 1
                }).then(function(user) {
                    should.exist(user);
                    if (user) {
                        User.destroy({
                            where: {
                                id: user.id
                            }
                        }).then(function() {
                            done();
                        });
                    }
                    else {
                        done();
                    }
                });
            }
            else {
                console.log("User Just4Test has been occupied!");
                done();
            }
        });
    });
    /**
     * Test if it can delete a user in database
     */
    it('Delete a User', function(done) {
        User.findOne({
            where: {
                username: 'Just4Test'
            }
        }).then(function(user) {
            if (!user) {
                User.create({
                    username: 'Just4Test',
                    password: '1234',
                    createdAt: 2
                }).then(function(user) {
                    if (user) {
                        User.destroy({
                            where: {
                                id: user.id
                            }
                        }).then(function() {
                            User.findOne({
                                where: {
                                    id: user.id
                                }
                            }).then(function(user) {
                                should.not.exist(user);
                                done();
                            });
                        });
                    }
                    else {
                        console.log("Create new user failed!");
                        done();
                    }
                });
            }
            else {
                console.log("User Just4Test has been occupied!");
                done();
            }
        });
    });
    /**
     * Test if it can find a user by name
     */
    it('Find an existing user by Name', function(done) {
        User.findOne({
            where: {
                username: 'Just4Test'
            }
        }).then(function(user) {
            if (!user) {
                User.create({
                    username: 'Just4Test',
                    password: '1234',
                    createdAt: 3
                });
                User.findOne({
                    where: {
                        username: 'Just4Test'
                    }
                }).then(function(user) {
                    should.exist(user);
                    if (user) {
                        User.delete(user.id);
                    }
                    done();
                });
            }
            else {
                console.log("User Just4Test has been occupied!");
                done();
            }
        });
    });
    /**
     * Test if it can detect a null user
     */
    it('Find a null user', function(done) {
        User.findOne({
            where: {
                username: 'Just4Test'
            }
        }).then(function(user) {
            if (user) {
                User.destroy({
                    where: {
                        id: user.id
                    }
                }).then(function() {
                    User.findOne({
                        where: {
                            username: 'Just4Test'
                        }
                    }).then(function(user) {
                        should.not.exist(user);
                        done();
                    });
                });
            }
            else {
                User.findOne({
                    where: {
                        username: 'Just4Test'
                    }
                }).then(function(user) {
                    should.not.exist(user);
                    done();
                });
            }
        });
    });
    /**
     * Test if it can check valid password
     */
    it('Checking password', function(done) {
        User.findOne({
            where: {
                username: 'Just4Test'
            }
        }).then(function(user) {
            if (!user) {
                User.create({
                    username: 'Just4Test',
                    password: '1234',
                    createdAt: 4
                }).then(function(user) {
                    user.password.should.equal('1234');
                    if (user) {
                        User.destroy({
                            where: {
                                id: user.id
                            }
                        }).then(function() {
                            done();
                        });
                    }
                    else {
                        done();
                    }
                });
            }
            else {
                console.log("User Just4Test has been occupied!");
                done();
            }
        });
    });
    /**
     * Test if it can check invalid password
     */
    it('Checking invalid passowrd', function(done) {
        User.findOne({
            where:{
                username: 'Just4Test'
            }
        }).then(function(user) {
            if(!user) {
                User.create({
                    username:'Just4Test',
                    password:'1234',
                    createdAt: 5
                }).then(function(user) {
                    user.password.should.not.equal('4321');
                    if (user) {
                        User.destroy({
                            where: {
                                id: user.id
                            }
                        }).then(function() {
                            done();
                        });
                    }
                    else {
                        done();
                    }
                });
            }
            else {
                console.log('User Just4Test has been occupied!');
                done();
            }
        });
    });

    after(function(done) {
        User.sync({force: true}).then(function() {
            done();
        });
    });
});