var router = require('express').Router();
var User = require('../models/User');
var Session = require('../Session');

/* Send a chat message to another user */
router.post('/message/private/:fromUserName/:toUserName', loginRequired);
router.post('/message/private/:fromUserName/:toUserName', function(req, res){
    //validate the request body
    if( typeof req.body.content === 'undefined' ||
        typeof req.body.postedAt === 'undefined'){
        res.status(422).json({});
        return;
    }

    //validate the current login user is the sender or not
    if(fromUserName != request.session.user.username){
        res.status(401).json({});
        return;
    }

    User.findOne({
        where: toUserName
    }).then(function(user){
        if(!user){
            res.status(404).json({});
        }else{
            Message.create({
                content: req.body.content,
                author: fromUserName,
                target: toUserName,
                messageType: 'CHAT',
                postedAt: parseInt(postedAt)
            }).then(function(message){
                res.status(201).json({});
            });
        }
    });
});
