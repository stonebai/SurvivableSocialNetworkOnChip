/**
 * Created by baishi on 3/24/16.
 */
var router = require('express').Router();
var io = require('../socket');
var Session = require('../models/Session');
router.Member = require('../models/Member');
router.Room = require('../models/Room');

router.get('/:roomname', Session.loginRequired);
router.get('/:roomname', function(req, res) {
    router.Member.findAll({
        where: {
            roomname: req.params.roomname
        }
    }).then(function(members) {
        res.status(200).json(members);
    });
});

router.get('/rooms/:username', Session.loginRequired);
router.get('/rooms/:username', function(req, res) {
    router.Member.findAll({
        where: {
            username: req.params.username
        }
    }).then(function(members) {
        res.status(200).json(members);
    });
});

router.post('/:roomname', Session.loginRequired);
router.post('/:roomname', function(req, res) {
    router.Room.findOne({
        where: {
            roomname: req.params.roomname
        }
    }).then(function(room) {
        if(room) {
            if (room.creatorname==req.body.username) {
                res.status(204).end();
            }
            else if(room.creatorname==req.body.creatorname) {
                router.Member.findOne({
                    where: {
                        roomname: req.params.roomname,
                        username: req.body.username
                    }
                }).then(function(mem) {
                    if(mem) {
                        res.status(205).end();
                    }
                    else {
                        router.Member.create({
                            roomname: req.params.roomname,
                            username: req.body.username
                        }).then(function(member) {
                            io.emit('add_member', member);
                            res.status(201).json(member);
                        });
                    }
                });
            }
            else {
                res.status(401).end();
            }
        }
        else {
            res.status(401).end();
        }
    });
});

router.put('/:roomname', Session.loginRequired);
router.put('/:roomname', function(req, res) {
    router.Room.findOne({
        where: {
            roomname: req.params.roomname
        }
    }).then(function(room) {
        if(room) {
            if(room.creatorname==req.body.creatorname || req.body.self) {
                router.Member.destroy({
                    where: {
                        roomname: req.params.roomname,
                        username: req.body.username
                    }
                }).then(function(member) {
                    io.emit('remove_member', {username: req.body.username, roomname: req.params.roomname});
                    res.status(200).json(member);
                });
            }
            else {
                res.status(401).end();
            }
        }
        else {
            res.status(401).end();
        }
    });
});

module.exports = router;