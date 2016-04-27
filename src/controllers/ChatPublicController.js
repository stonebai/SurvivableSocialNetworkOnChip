/**
 * Created by Edison on 2016/2/28.
 */
var router = require('express').Router();
var User = require('../models/User');
var Session = require('../models/Session');
var RequestRecord = require('../utils/RequestRecord');

router.Message = require('../models/PublicMessage');
router.UserHistroy = require('../models/UserHistory');

router.post('/:fromUserName', RequestRecord.record);
router.post('/:fromUserName', Session.loginRequired);
router.post('/:fromUserName', function(req, res){
    if(typeof req.body.content === 'undefined' ||
        typeof req.body.postedAt === 'undefined'){
            res.status(422).end();
            return;
    }

    if(req.params.fromUserName != req.session.user.name){
        res.status(401).end();
        return;
    }

    User.findOne({
        where: {
            username: req.params.fromUserName
        }
    }).then(function(user){
        if(!user){
            res.status(404).end();
        }else{
            router.Message.create({
                content: req.body.content,
                author: user.id,
                postedAt: parseInt(req.body.postedAt)
            }).then(function(message){
                var historyContent = req.body.content;
                console.log(historyContent);
                router.UserHistroy.create({
                    timestamp: new Date(),
                    username: req.params.fromUserName,
                    type: 3,
                    content: historyContent
                }).then(function() {
                    res.status(201).json(message);
                });
            });
        }
    });
});

router.get('/', RequestRecord.record);
router.get('/', Session.loginRequired);
router.get('/', function(req, res) {
    router.Message.findAll({
        order: 'postedAt ASC'
    }).then(function(messages) {
        res.status(200).json(messages);
    });
});


router.get('/:count', function(req, res){

});

module.exports = router;
