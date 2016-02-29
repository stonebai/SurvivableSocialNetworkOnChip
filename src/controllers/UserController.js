var router = require('express').Router();
var User = require('../models/User');
var Session = require('../models/Session');
var io = require('../socket.js');

/* Register or Login API */
router.post('/:userName', function(req, res){
    //validate the request body
    if( typeof req.body.password === 'undefined' ||
        typeof req.body.createdAt === 'undefined'){
        //Unprocessable Entity -- used for validation errors
        res.status(422).end();
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
                    password: password,
                    createdAt: parseInt(req.body.createdAt)
                }).then(function(user){
                    Session.login(req, user);
                    user.password = undefined;
                    //if new user is created, status code = 201
                    User.findOne({
                        where: {
                            id: user.id
                        }
                    }).then(function(user){
                        if(!user){
                            res.status(404).end();
                        }else{
                            Session.login(req, user);
                            user.password = undefined;
                            res.status(201).json(user);
                        }
                    });
                });
            }else{
                User.findOne({
                    where: {
                        id: user.id
                    }
                }).then(function(user){
                    if(user.password == password){
                        Session.login(req, user);
                        user.password = undefined;
                        //if user exists, status code = 200
                        res.status(200).json(user);
                    }else{
                        res.status(401).end();
                    }
                });
            }
        });
    }
});

/*update*/
router.put('/current', Session.loginRequired);
router.put('/current', function(req, res) {
    if( typeof req.body.lastStatusCode === 'undefined'){
        res.status(422).end();
        return;
    }

    var userID = req.session.user.id;
    User.findOne({
        attributes: ['id', 'username', 'createdAt', 'updatedAt', 'lastLoginAt',
            'lastStatusCode', 'accountStatus'],
        where: {
            id: userID
        }
    }).then(function(user) {
        if (!user) {
            res.status(404).end();
        } else {
            user.update({
                lastStatusCode: req.body.lastStatusCode
            }).then(function(x){
                console.log(x);
                user.password = undefined;
                io.io().emit('status change', user);
                res.status(200).json(x);
            }, function(){
                res.status(404).end();
            });
        }
    });
});

/* Logout */
router.delete('/logout', Session.loginRequired);
router.delete('/logout', function(req, res){
    Session.logout(req);
    res.status(204).end();
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
            res.status(404).end();
        } else {
            res.status(200).json(user);
        }
    });
});



module.exports = router;
