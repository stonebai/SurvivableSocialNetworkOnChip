/**
 * Created by baishi on 3/24/16.
 */
var router = require('express').Router();
var io = require('../socket');
router.Room = require('../models/Room');
router.Member = require('../models/Member');

/**
 * Every rest api test start with:
 * curl -i -H "Accept: application/json" -X POST -d "password=1234&createdAt=1234&force=true" http://localhost:4000/users/User4APITest
 */

// curl http://localhost:4000/room/User4APITest
router.get('/rooms/:username', function(req, res) {
    router.Room.findAll({
        where: {
            creatorname: req.params.username
        }
    }).then(function(rooms) {
        res.status(200).json(rooms);
    });
});

// curl http://localhost:4000/room/Room4Test
router.get('/:roomname', function(req, res) {
    router.Room.findOne({
        where: {
            roomname: req.params.roomname
        }
    }).then(function(room) {
        res.status(200).json(room);
    });
});

// curl -i -H "Accept: application/json" -X POST -d "roomname=Room4Test&creatorname=User4APITest" http://localhost:4000/room/
router.post('/', function(req, res) {
    if(req.body.roomname.trim()=='') res.status(400).end();
    router.Room.findOne({
        where: {
            roomname: req.body.roomname
        }
    }).then(function(room) {
        if(room) {
            res.status(409).end();
        }
        else {
            router.Room.create({
                roomname: req.body.roomname,
                creatorname: req.body.creatorname
            }).then(function(room) {
                if(room) {
                    io.emit("room_create", room);
                    res.status(201).json(room);
                }
                else {
                    res.status(500).end();
                }
            });
        }
    });
});

// curl -i -H "Accept: application/json" -X PUT -d '{"roomname":"Room4Test", "creatorname":"User4APITest"}' http://localhost:4000/room/
router.put('/', function(req, res) {
    router.Room.destroy({
        where: {
            roomname: req.body.roomname,
            creatorname: req.body.creatorname
        }
    }).then(function(room) {
        io.emit('room_destroy', {roomname: req.body.roomname, creatorname: req.body.creatorname});
        router.Member.destroy({
            where: {
                roomname: req.body.roomname
            }
        }).then(function() {
            res.status(200).end();
        });
    });
});

module.exports = router;