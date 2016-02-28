var router = require('express').Router();
var User = require('../models/User');
var Session = require('../models/Session');

/* Register or Login API */
router.post('/:userName', function(req, res){
    //validate the request body
    if( typeof req.body.password === 'undefined' ||
        typeof req.body.createdAt === 'undefined'){
        //Unprocessable Entity -- used for validation errors
        res.status(422).json({});
    }else{
        var username = req.params.userName;
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
                    password: password
                }).then(function(user){
                    Session.login(req, user);
                    user.password = undefined;
                    //if new user is created, status code = 201
                    res.status(201).json(user);
                });
            }else{
                if(user.password == password){
                    Session.login(req, user);
                    user.password = undefined;
                    //if user exists, status code = 200
                    res.status(200).json(user);
                }else{
                    res.status(401).json({});
                }
            }
        });
    }
});


/* Logout */
router.delete('/logout', Session.loginRequired);
router.delete('/logout', function(req, res){
    Session.logout(req, Session.user);
    res.status(200).json({});
});


/* Retireve all users */
router.get('/', Session.loginRequired);
router.get('/', function(req, res){
    User.findAll({
        attributes: ['id', 'username', 'createdAt', 'updatedAt', 'lastLoginAt',
            'lastStatusCode', 'accountStatus'],
        where: {}
    }).then(function(users){
        res.status(200).json(users);
    });
});


/* Retrieve a user's record */
router.get('/:userName', Session.loginRequired);
router.get('/:userName', function(req, res){
    User.findOne({
        attributes: ['id', 'username', 'createdAt', 'updatedAt', 'lastLoginAt',
            'lastStatusCode', 'accountStatus'],
        where: {
            username: req.params.userName
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
