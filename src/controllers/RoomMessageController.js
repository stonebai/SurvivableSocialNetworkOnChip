/**
 * Created by baishi on 4/1/16.
 */
var router = require('express').Router();
var io = require('../socket');
var Session = require('../models/Session');
router.Message = require('../models/RoomMessage');

/**
 * URL: http://localhost:4000/roommessage/Room4Test
 */
router.get('/:roomname', Session.loginRequired);
router.get('/:roomname', function(req, res) {
    router.Message.findAll({
        where: {
            roomname: req.params.roomname
        }
    }).then(function(messages) {
        res.status(200).json(messages);
    });
});

/**
 * URL: http://localhost:4000/roommessage/User4APITest/Room4Test
 * Body:
 {
    "content": "Content4Test",
    "postedAt": 1234
 }
 */
router.post('/:username/:roomname', Session.loginRequired);
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
