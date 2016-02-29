/**
 * Created by baishi on 2/24/16.
 */
var expect = require('expect.js');
var User = require('../src/models/user');

suite('User testing', function() {

    test('Create a New User', function(done) {
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
                    expect(user).not.to.eql(null);
                    if (user) {
                        User.delete(user.id);
                    }
                });
            }
            else {
                console.log("User Just4Test has been occupied!");
            }
        });
        done();
    });

    test('Delete a User', function(done) {
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
                    if (user) {
                        User.delete(user.id);
                        User.findOne({
                            where: {
                                id: user.id
                            }
                        }).then(function(user) {
                            expect(user).to.eql(null);
                        });
                    }
                    else {
                        console.log("Create new user failed!");
                    }
                });
            }
            else {
                console.log("User Just4Test has been occupied!");
            }
        });
        done();
    });

    test('Find an existing user by Name', function(done) {
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
                });
            }
            else {
                console.log("User Just4Test has been occupied!");
                done();
            }
        });
        User.findOne({
            where: {
                username: 'Just4Test'
            }
        }).then(function(user) {
            expect(user).not.to.eql(null);
            if (user) {
                User.delete(user.id);
            }
        });
        done();
    });

    test('Checking password', function(done) {
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
                    expect(user.password).to.eql('1234');
                    if (user) {
                        User.delete(user.id);
                    }
                });
            }
            else {
                console.log("User Just4Test has been occupied!");
            }
        });
        done();
    });
});