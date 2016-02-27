/**
 * Created by baishi on 2/8/16.
 */
var api = require('express').Router();
var User = require('../models/user');
var Message = require('../models/message');
var Announcement = require('../models/announcement');

api.get('/checklogin', function (req, res) {
    if (!req.session || !req.session.username) {
        res.json({ 'logined': false });
    }
    else {
        res.json({ 'logined': true, 'username': req.session.username });
    }
});

api.post('/login', function(req, res) {
    User.findOne({
        where: {
            username: req.body.loginUsername
        }
    }).then(function (user) {
        if(user!=null) {
            if (user.password==req.body.loginPassword) {
                req.session.uid = user.id;
                req.session.username = req.body.loginUsername;
                res.json({login:'success'});
            }
            else {
                res.json({login:'fail'});
            }
        }
        else {
            res.json({login:'empty'});
        }
    });
});

api.post('/register', function(req, res) {
    User.findOne({
        where: {
            username: req.body.registerUsername
        }
    }).then(function (user) {
        if(user==null) {
            User.create({
                username: req.body.registerUsername,
                password: req.body.registerPassword
            }).then(function (user) {
                req.session.uid = user.id;
                req.session.username = user.username;
                res.json({register: true});
            });
        }
        else {
            res.json({register: false});
        }
    });
});

api.get('/users', function(req, res) {
    console.log("session id " + req.session.id)
    User.findAll({
        attributes: ['id', 'username'],
        where: {
            "id": {
                $ne: req.session.uid,
            }
        }
    }).then(function(users){
        res.json(users);
    });
});

api.get('/session', function(req, res) {
    res.json(req.session);
});

api.get('/messages', function(req, res) {
    Message.findAll().then(function(messages) {
        res.json(messages);
    });
});

api.get('/announcements', function(req, res) {
    Announcement.findAll().then(function(announcements) {
        res.json(announcements);
    });
});

api.post('/logout', function(req, res) {
    req.session.destroy();
    res.json({'status' : 'OK'});
});

module.exports = api;
