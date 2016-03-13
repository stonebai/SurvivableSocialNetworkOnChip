/**
 * Created by Edison on 2016/2/28.
 */
var router = require('express').Router();
var User = require('../models/User');
var Session = require('../models/Session');
var Message = require('../models/PublicMessage');

router.get('/', Session.loginRequired);
router.get('/', function(req, res) {
    Message.findAll({
        order: 'postedAt ASC'
    }).then(function(messages) {
        res.status(200).json(messages);
    });
});

router.get('/:count', function(req, res){

});

module.exports = router;