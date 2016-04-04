var router = require('express').Router();
var Session = require('../models/Session');
var io = require('../socket.js');
var UserDict = require('../UserDict.js');
var illegalUsername = require('../models/IllegalUsername');

router.User = User = require('../models/User');

/* Register or Login API */
router.post('/:userName', function(req, res){
    //validate the request body
    console.log(req.body);
    if( typeof req.body.password === 'undefined' ||
        typeof req.body.createdAt === 'undefined'){
        //Unprocessable Entity -- used for validation errors
        res.status(422).end();
    }else{
        var username = req.params.userName;
        var password = req.body.password;
        //todo timestamp

        //check the illegal userName
        for(i = 0; i < illegalUsername.length; i++){
            if(illegalUsername[i] == req.params.userName){
                res.status(403).end();
                return;
            }
        }

        router.User.findOne({
            where: {
                username: username
            }
        }).then(function(user){
            if(!user) {
                if (req.body.force) {
                    router.User.create({
                        username: username,
                        password: password,
                        createdAt: parseInt(req.body.createdAt)
                    }).then(function(user){
                        //Session.login(req, user);
                        //user.password = undefined;
                        //if new user is created, status code = 201
                        router.User.findOne({
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
                }
                else {
                    res.status(205).end();
                }
            } else{
                router.User.findOne({
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
    router.User.findOne({
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
    router.User.findAll({
        attributes: ['id', 'username', 'createdAt', 'updatedAt', 'lastLoginAt',
            'lastStatusCode', 'accountStatus'],
        where: {}
    }).then(function(users){
        for(var i = 0; i < users.length; i++) {
            users[i].dataValues.online = UserDict.isOnline(users[i].id);
        }
        res.status(200).json(users);
    });
});


/* Retrieve a user's record */
router.get('/:userName', Session.loginRequired);
router.get('/:userName', function(req, res){
    router.User.findOne({
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
