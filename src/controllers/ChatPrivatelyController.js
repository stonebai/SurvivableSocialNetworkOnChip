var router = require('express').Router();
var User = require('../models/User');
var Session = require('../models/Session');
router.Message = Message = require('../models/PrivateMessage');

/* Send a chat message to another user */
router.post('/:fromUserName/:toUserName', Session.loginRequired);
router.post('/:fromUserName/:toUserName', function(req, res){
    //validate the request body
    if( typeof req.body.content === 'undefined' ||
        typeof req.body.postedAt === 'undefined'){
        res.status(422).end();
        return;
    }

    //console.log(req.params.fromUserName);
    //console.log(req.session.user.name);

    //validate the current login user is the sender or not
    if(req.params.fromUserName != req.session.user.name){
        res.status(401).end();
        return;
    }

    User.findOne({
        where: {
            username: req.params.toUserName,
        }
    }).then(function(user){
        if(!user){
            res.status(404).end();
        }else{
            router.Message.create({
                content: req.body.content,
                author: req.session.user.id,
                target: user.id,
                postedAt: parseInt(req.body.postedAt)
            }).then(function(message){
                res.status(201).json(message);
            });
        }
    });
});

/* Retrieve all private chat messages between two users	*/
router.get('/:userName1/:userName2', Session.loginRequired);
router.get('/:userName1/:userName2', function(req, res){
    //validate the current login user is the sender or receiver
    var user1Id;
    var user2Id;

    if (req.params.userName1 == req.session.user.name) {
        user1Id = req.session.user.id;
        User.findOne({
            where: {
                username: req.params.userName2
            }
        }).then(function(user){
            if (!user) {
                res.status(404).end();
            } else {
                user2Id = user.id;
                router.Message.findAll({
                    where: {
                        $or: [
                            {
                                author: user1Id,
                                target: user2Id
                            },
                            {
                                author: user2Id,
                                target: user1Id
                            }
                        ]
                    },
                    order: 'postedAt ASC'
                }).then(function(messages){
                    res.status(200).json(messages);
                });
            }
        });
    } else if (req.params.userName2 == req.session.user.name) {
        user2Id = req.session.user.id;
        User.findOne({
            where: {
                username: req.params.userName1
            }
        }).then(function(user) {
            if (!user) {
                res.status(404).end();
            } else {
                user1Id = user.id;
                router.Message.findAll({
                    where: {
                        $or: [
                            {
                                author: user1Id,
                                target: user2Id
                            },
                            {
                                author: user2Id,
                                target: user1Id
                            }
                        ]
                    },
                    order: 'postedAt ASC'
                }).then(function(messages){
                    res.status(200).json(messages);
                });
            }
        });
    }
});

module.exports = router;
