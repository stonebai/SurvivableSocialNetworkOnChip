/**
 * Created by baishi on 4/1/16.
 */
var router = require('express').Router();
var io = require('../socket');
router.Message = require('../models/RoomMessage');

router.get('/:roomname', function(req, res) {
    router.Message.findAll({
        where: {
            roomname: req.params.roomname
        }
    }).then(function(messages) {
        res.status(200).json(messages);
    });
});

router.post('/:username/:roomname', function(req, res) {
    if( typeof req.body.content === 'undefined' ||
        typeof req.body.postedAt === 'undefined' ||
        req.body.content.trim() == '') {
        res.status(422).end();
        return;
    }

    router.Message.create({
        content: req.body.content,
        author: req.params.username,
        roomname: req.params.roomname,
        postedAt: req.body.postedAt
    }).then(function(message) {
        io.emit('room_message', message);
        res.status(201).end();
    });
});

module.exports = router;
