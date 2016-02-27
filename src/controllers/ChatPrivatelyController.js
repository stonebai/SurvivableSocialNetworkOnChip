var router = require('express').Router();
var User = require('../models/User');
var Session = require('../models/Session');

/* Send a chat message to another user */
router.post('/private/:fromUserName/:toUserName', Session.loginRequired);
router.post('/private/:fromUserName/:toUserName', function(req, res){
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
        where: {
            username: toUserName
        }
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


/* Retrieve all private chat messages between two users	*/
router.get('/private/:userName1/:userName2', Session.loginRequired);
router.get('/private/:userName1/:userName2', function(req, res){
    //validate the current login user is the sender or receiver
    var isValid = true;
    if (userName1 == request.session.user.username) {
        User.findOne({
            where: {
                username: userName2
            }
        }).then(function(user){
            if (!user) {
                res.status(404).json({});
                isValid = false;
            }
        });
    } else if (userName2 == request.session.user.username){
        User.findOne({
            where: {
                username: userName1
            }
        }).then(function(user) {
            if (!user) {
                res.status(404).json({});
                isValid = false;
            }
        });

    }

    if (!isValid) {
        return;
    }

    Message.findAll({
        where: {
            author: userName1,
            target: userName2
        }
    }).then(function(messages1){
        Message.findAll({
            where: {
                author: userName2,
                target: userName1
            }
        }).then(function(messages2){
            messages = messages1.concat(messages2);


            messages.sort(function(a, b) {
                return a.postedAt - b.postedAt;
            });

            res.status(200).json(messages);

        });
    });
});

module.exports = router;
