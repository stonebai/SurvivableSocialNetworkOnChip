/**
 * Created by baishi on 3/10/16.
 */
var should = require('should');
var Announcement = require('../src/models/AnnouncementTest');

describe('Announcement Model Tests', function() {
    /**
     * Test if it can create a new announcement in database
     */
    it('Create a New Announcement', function(done) {
        Announcement.create({
            author: 'Just4Test',
            content: 'Just4Test',
            timestamp: new Date(),
            location: null
        }).then(function(announcement) {
            should.exist(announcement);
            announcement.author.should.equal('Just4Test');
            announcement.content.should.equal('Just4Test');
            if(announcement) {
                Announcement.destroy({
                    where: {
                        id: announcement.id
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
     * Test the new announcement's content is not incorrect
     */
    it('Incorrect Content Test', function(done) {
        Announcement.create({
            author: 'Just4Test',
            content: 'Just4Test',
            timestamp: new Date(),
            location: null
        }).then(function(announcement) {
            should.exist(announcement);
            announcement.author.should.not.equal('Just5Test');
            announcement.content.should.not.equal('Just5Test');
            if(announcement) {
                Announcement.destroy({
                    where: {
                        id: announcement.id
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
     * Test if it can find an announcement by content
     */
    it('Find an existing Announcement by content', function(done) {
        Announcement.findOne({
            where: {
                content: 'Just4Test'
            }
        }).then(function(announcement) {
            if(!announcement) {
                Announcement.create({
                    author: 'Just4Test',
                    content: 'Just4Test',
                    timestamp: new Date(),
                    location: null
                }).then(function() {
                    Announcement.findOne({
                        content: 'Just4Test'
                    }).then(function(data) {
                        should.exist(data);
                        if(data) {
                            Announcement.destroy({
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
     * Test if it can delete an announcement in database
     */
    it('Delete an Announcement', function(done) {
        Announcement.create({
            author: 'Just4Test',
            content: 'Just4Test',
            timestamp: new Date(),
            location: null
        }).then(function(announcement) {
            Announcement.destroy({
                where: {
                    id: announcement.id
                }
            }).then(function() {
                Announcement.findOne({
                    where: {
                        id: announcement.id
                    }
                }).then(function(data) {
                    should.not.exist(data);
                    if(data) {
                        Announcement.destroy({
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
     * Test if it can get a list of announcements in database
     */
    it('Get a List of Announcements', function(done) {
        Announcement.findAll().then(function(announcements) {
            announcements.should.be.instanceOf(Array);
            done();
        });
    });

    after(function(done) {
        Announcement.sync({force: true}).then(function() {
            done();
        });
    });
});