/**
 * Created by Edison on 2016/2/28.
 */
var router = require('express').Router();
var User = require('../models/User');
var Session = require('../models/Session');
var Message = require('../models/PublicMessage');
var RequestRecord = require('../utils/RequestRecord');

router.Message = require('../models/PublicMessage');

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
                res.status(201).json(message);
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
