/**
 * Created by baishi on 3/8/16.
 */
var router = require('express').Router();
var Session = require('../models/Session');
var io = require('../socket');
router.Announcement = Announcement = require('../models/Announcement');
router.User = require('../models/User');

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
    if (req.body.content == 'undefined' || req.body.content.trim() == '') {
        res.status(406).end();
    }
    else if (req.body.author != req.session.user.name) {
        res.status(401).end();
    }
    else {
        router.User.findOne({
            where: {
                username: req.body.author
            }
        }).then(function(user) {{
            if(!user) {
                res.status(404).end();
            }
            else {
                io.emit('post annoucement', req.body);
                router.Announcement.create({
                    author: req.body.author,
                    content: req.body.content,
                    timestamp: req.body.timestamp,
                    location: req.body.location
                }).then(function(announcement) {
                    if(announcement) res.status(201).end();
                    else res.status(503).end();
                });
            }
        }});
    }
});

module.exports = router;