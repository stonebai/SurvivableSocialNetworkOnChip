/**
 * Created by baishi on 2/8/16.
 */
var api = require('express').Router();
var Announcement = require('../models/announcement');
var User = require('../models/User');
var Message = require('../models/PublicMessage');
var Session = require('../models/Session');


api.get('/checklogin', function (req, res) {
    if (!req.session.user) {
        res.status(201).json({});
    }
    else {
        User.findOne({
            attributes: ['id', 'username', 'createdAt', 'updatedAt', 'lastLoginAt',
                'lastStatusCode', 'accountStatus'],
            where: {
                id: req.session.user.id
            }
        }).then(function(user){
            if (!user) {
                res.status(404).end();
            } else {
                res.status(200).json(user);
            }
        });
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
                res.json({
                    login:'success',
                    'user': {'id' : user.id, "username": user.username}
                });
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
                res.json({
                    register: true,
                    user: {'id' : user.id, "username": user.username}
                });
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

api.get('/messages/private/:uid1/:uid2', function(req, res){
    var uid1 = req.params.uid1;
    var uid2 = req.params.uid2;
    console.log("uid1: " + uid1 + "  uid2: " + uid2);
    res.json([]);
});

module.exports = api;
