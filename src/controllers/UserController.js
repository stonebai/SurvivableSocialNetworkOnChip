var router = require('express').Router();
var User = require('../models/User');
var Session = require('../models/Session');

/* Register or Login API */
router.post('/:userName', function(req, res){
    //validate the request body
    var userName = req.params.userName;

    if( typeof req.body.password === 'undefined' ||
        typeof req.body.createdAt === 'undefined'){
        //Unprocessable Entity -- used for validation errors
        res.status(422).json({});
    }else{
        var username = userName;
        var password = req.body.password;
        var createdAt = req.body.createdAt;
        //todo timestamp

        User.findOne({
            where: {
                username: username
            }
        }).then(function(user){
            if(!user){
                User.create({
                    username: username,
                    password: password,
                    createdAt : createdAt,
                    updatedAt : createdAt,
                    lastLoginAt : createdAt,
                }).then(function(user){
                    Session.login(req, user);
                    //if new user is created, status code = 201
                    res.status(201).json(user);
                });
            }else{
                if(user.password == password){
                    Session.login(req, user);
                    //if user exists, status code = 200
                    res.status(200).json(user);
                }else{
                    res.status(401).json();
                }
            }
        });
    }
});

/* Retireve all users */
router.get('/', Session.loginRequired);
router.get('/', function(req, res){
    User.findAll({
        attributes: ['id', 'username'],
        where: {}
    }).then(function(users){
        res.status(200).json(users);
    });
});


/* Retrieve a user's record */
router.get('/:userName', Session.loginRequired);
router.get('/:userName', function(req, res){
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

module.exports = router
