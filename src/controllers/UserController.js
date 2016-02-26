var router = require('express').Router();
var User = require('../models/user.js');
var Session = require('../models/Session.js');

/* Register or Login API */
router.post('/users/:userName', function(req, res){
    //validate the request body
    if( typeof req.body.password === 'undefined' ||
        typeof req.body.createdAt === 'undefined'){
        //Unprocessable Entity -- used for validation errors
        res.status(422).json({});
    }else{
        var username = userName;
        var password = req.body.password;
        //todo timestamp

        User.findOne({
            where: {
                username: username
            }
        }).then(function(user){
            if(!user){
                User.create({
                    username: username,
                    password: passowrd
                }).then(function(user){
                    Session.login(req, user);
                    //if new user is created, status code = 201
                    res.status(201).json({});
                });
            }else{
                Session.login(req, user);
                //if user exists, status code = 200
                res.status(200).json({});
            }
        });
    }
});

/* Retireve all users */
router.get('/users', function(req, res){
    User.findAll({
        attributes: ['id', 'username'],
        where: {}
    }).then(function(users){
        res.status(200).json(users);
    });
});


/* Retrieve a user's record */
router.get('/users/:userName', function(req, res){
    User.findOne({
        where: {
            username: userName
        }
    }).then(function(user){
        if (!user) {
            res.status(404).json({});
        } else {
            res.status(200).json(user);
        }
    });
});
