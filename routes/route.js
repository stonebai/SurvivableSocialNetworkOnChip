/**
 * Created by baishi on 2/6/16.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var User = require(path.join(__dirname, '../models/user'));

router.get('/', function(req, res, next) {
    if(req.session.username!=null && req.session.password!=null) {
        User.findOne({
            where: {
                username: req.session.username
            }
        }).then(function(user) {
            if(user.password!=null && user.password==req.session.password) {
                res.sendFile(path.join(__dirname, '../views/chat.html'));
            }
            else {
                res.redirect('/login');
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.post('/chat', function(req, res) {
    User.findOne({
        where: {
            username: req.body.loginUsername
        }
    }).then(function (user) {
        if(user.password==req.body.password) {
            req.session.username = req.body.loginUsername;
            req.session.username = req.body.loginPassword;
            res.sendFile(__dirname + '/../views/chat.html');
        }
    });
});

module.exports = router;