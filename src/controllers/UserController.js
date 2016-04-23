var router = require('express').Router();
var Session = require('../models/Session');
var io = require('../socket.js');
var UserDict = require('../UserDict.js');
var illegalUsername = require('../models/IllegalUsername');
router.AgencyContact = require('../models/AgencyContact');

var RequestRecord = require('../utils/RequestRecord');

router.User = require('../models/User');
router.UserHistroy = require('../models/UserHistory');

/* Register or Login API */
router.post('/:userName', RequestRecord.record);
router.post('/:userName', function(req, res){
    //validate the request body
    //console.log(req.body);
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
				createdAt: parseInt(req.body.createdAt),
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
                                router.UserHistroy.create({
                                    timestamp: new Date(),
                                    username: user.username,
                                    type: 1,
                                    content: 'signed up to the SSNoC system'
                                }).then(function() {
                                    res.status(201).json(user);
                                });
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
                    if(user.password != password){
                        res.status(401).end();
                    } else if(user.accountStatus != 'ACTIVE'){
                        res.status(406).end();
                    } else {
                        Session.login(req, user);
                        user.password = undefined;
                        //if user exists, status code = 200
                        router.UserHistroy.create({
                            timestamp: new Date(),
                            username: user.username,
                            type: 1,
                            content: 'signed in to the SSNoC system'
                        }).then(function() {
                            res.status(200).json(user);
                        });
                    }
                });
            }
        });
    }
});

/*update*/
router.put('/current', RequestRecord.record);
router.put('/current', Session.loginRequired);
router.put('/current', function(req, res) {
    if( typeof req.body.lastStatusCode === 'undefined'){
        res.status(422).end();
        return;
    }

    var userID = req.session.user.id;
    router.User.findOne({
        attributes: ['id', 'username', 'createdAt', 'updatedAt', 'lastLoginAt',
            'lastStatusCode', 'accountStatus', 'privilege'],
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
                //console.log(x);
                user.password = undefined;


                router.AgencyContact.findAll({
                    where: {
                        author: user.username,
                    }
                }).then(function(agencyContact){
                    //return res.status(200).json(agencyContact);
                    user.contacts = agencyContact;
                    io.io().emit('status change', {
                        user: user,
                        contacts: agencyContact,
                    });
                    router.UserHistroy.create({
                        timestamp: new Date(),
                        username: user.username,
                        type: 2,
                        content: 'changed status to ' + req.body.lastStatusCode
                    }).then(function() {
                        res.status(200).json(x);
                    });
                });

            }, function(){
                res.status(404).end();
            });
        }
    });
});

/* Logout */
router.delete('/logout', RequestRecord.record);
router.delete('/logout', Session.loginRequired);
router.delete('/logout', function(req, res){
    router.UserHistroy.create({
        timestamp: new Date(),
        username: req.session.user.name,
        type: 1,
        content: 'logged out the SSNoC system'
    }).then(function() {
        Session.logout(req);
        res.status(204).end();
    });
});


/* Retireve all users */
router.get('/', RequestRecord.record);
router.get('/', Session.loginRequired);
router.get('/', function(req, res){
    router.User.findAll({
        attributes: ['id', 'username', 'createdAt', 'updatedAt', 'lastLoginAt',
		     'lastStatusCode', 'accountStatus', 'privilege','lat','lng'],
        where: {}
    }).then(function(users){
        for(var i = 0; i < users.length; i++) {
            users[i].dataValues.online = UserDict.isOnline(users[i].id);
        }
        res.status(200).json(users);
    });
});


/* Retrieve a user's record */
router.get('/:userName', RequestRecord.record);
router.get('/:userName', Session.loginRequired);
router.get('/:userName', function(req, res){
    router.User.findOne({
        attributes: ['id', 'username', 'createdAt', 'updatedAt', 'lastLoginAt',
		     'lastStatusCode', 'accountStatus', 'privilege','lat','lng'],
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
