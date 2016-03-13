/**
 * Created by baishi on 3/8/16.
 */
var router = require('express').Router();
var Session = require('../models/Session');
var io = require('../socket');
router.Announcement = Announcement = require('../models/Announcement');

/**
 * Retrieve all announcements in database
 */
router.get('/', Session.loginRequired);
router.get('/', function(req, res) {
    router.Announcement.findAll().then(function(announcements) {
        res.status(200).json(announcements);
    });
});

/**
 * Post an announcement to database
 */
router.post('/', Session.loginRequired);
router.post('/', function(req, res) {
    io.emit('post annoucement', req.body);
    router.Announcement.create({
        author: req.body.author,
        content: req.body.content,
        timestamp: req.body.timestamp,
        location: req.body.location
    }).then(function(announcement) {
        if(announcement) res.status(201).end();
        else res.status(503).end();
    })
});

module.exports = router;