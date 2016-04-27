/**
 * Created by baishi on 3/8/16.
 */
var router = require('express').Router();
var Session = require('../models/Session');
var io = require('../socket');
var RequestRecord = require('../utils/RequestRecord');

router.Announcement = Announcement = require('../models/Announcement');
router.User = require('../models/User');
router.UserHistroy = require('../models/UserHistory');

/**
 * Retrieve all announcements in database
 */
router.get('/', RequestRecord.record);
router.get('/', Session.loginRequired);
router.get('/', function(req, res) {
    router.Announcement.findAll().then(function(announcements) {
        res.status(200).json(announcements);
    });
});

/**
 * Post an announcement to database
 */
router.post('/', RequestRecord.record);
router.post('/', Session.CoordinatorRequired);
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
                    if(announcement) {
                        router.UserHistroy.create({
                            timestamp: new Date(),
                            username: req.body.author,
                            type: 4,
                            content: '' + req.body.content
                        }).then(function() {
                            res.status(201).end();
                        });
                    }
                    else res.status(503).end();
                });
            }
        }});
    }
});

module.exports = router;
