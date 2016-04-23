/**
 * Created by baishi on 4/16/16.
 */
var should = require('should');
var UserHistory = require('../src/models/UserHistory');

describe('UserHistory Model Tests', function() {
    /**
     * Test if it can create a new UserHistory in database
     */
    it('Create a New UserHistory', function(done) {
        UserHistory.create({
            username: 'User4Test',
            content: 'Content4Test',
            timestamp: new Date(),
            type: 1
        }).then(function(userhistory) {
            should.exist(userhistory);
            userhistory.username.should.equal('User4Test');
            userhistory.content.should.equal('Content4Test');
            if(userhistory) {
                UserHistory.destroy({
                    where: {
                        id: userhistory.id
                    }
                }).then(function() {
                    done();
                });
            }
            else {
                done();
            }
        });
    });
    /**
     * Test the new userhistory's content is not incorrect
     */
    it('Incorrect Content Test', function(done) {
        UserHistory.create({
            username: 'User4Test',
            content: 'Content4Test',
            timestamp: new Date(),
            type: 1
        }).then(function(userhistory) {
            should.exist(userhistory);
            userhistory.username.should.not.equal('User5Test');
            userhistory.content.should.not.equal('Content5Test');
            if(userhistory) {
                UserHistory.destroy({
                    where: {
                        id: userhistory.id
                    }
                }).then(function() {
                    done();
                });
            }
            else {
                done();
            }
        });
    });
    /**
     * Test if it can find an userhistory by content
     */
    it('Find an existing UserHistory by content', function(done) {
        UserHistory.findOne({
            where: {
                content: 'Just4Test'
            }
        }).then(function(userhistory) {
            if(!userhistory) {
                UserHistory.create({
                    username: 'User4Test',
                    content: 'Content4Test',
                    timestamp: new Date(),
                    type: 1
                }).then(function() {
                    UserHistory.findOne({
                        content: 'Content4Test'
                    }).then(function(data) {
                        should.exist(data);
                        if(data) {
                            UserHistory.destroy({
                                where: {
                                    id: data.id
                                }
                            }).then(function() {
                                done();
                            });
                        }
                        else {
                            done();
                        }
                    });
                });
            }
            else {
                done();
            }
        });
    });
    /**
     * Test if it can delete an user history in database
     */
    it('Delete an UserHistory', function(done) {
        UserHistory.create({
            username: 'User4Test',
            content: 'Content4Test',
            timestamp: new Date(),
            type: 1
        }).then(function(userhistory) {
            UserHistory.destroy({
                where: {
                    id: userhistory.id
                }
            }).then(function() {
                UserHistory.findOne({
                    where: {
                        id: userhistory.id
                    }
                }).then(function(data) {
                    should.not.exist(data);
                    if(data) {
                        UserHistory.destroy({
                            where: {
                                id: data.id
                            }
                        }).then(function() {
                            done();
                        });
                    }
                    else {
                        done();
                    }
                });
            });
        });
    });
    /**
     * Test if it can get a list of userhistories in database
     */
    it('Get a List of UserHistories', function(done) {
        UserHistory.findAll().then(function(userhistories) {
            userhistories.should.be.instanceOf(Array);
            done();
        });
    });

    after(function(done) {
        UserHistory.destroy({
            where: {
                content: "Content4Test"
            }
        }).then(function() {
            done();
        });
    });
});
