/**
 * Created by baishi on 2/8/16.
 */
var api = require('express').Router();
var User = require('../models/user');
var Message = require('../models/message');

api.post('/login', function(req, res) {
    User.findOne({
        where: {
            username: req.body.loginUsername
        }
    }).then(function (user) {
        if(user!=null && user.password==req.body.loginPassword) {
            req.session.username = req.body.loginUsername;
            req.session.password = req.body.loginPassword;
            res.json({login:true});
        }
        else {
            res.json({login:false});
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
                res.json({register: true});
            });
        }
        else {
            res.json({register: false});
        }
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

module.exports = api;