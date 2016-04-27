/**
 * Created by Edison on 2016/4/10.
 */
var router = require('express').Router();
var Session = require('../models/Session');
var User = require('../models/User');
var illegalUsername = require('../models/IllegalUsername');
var io = require('../socket.js');
var UserDict = require('../UserDict');

function responseFormatError(res, msg) {
    return res.status(403).json({msg: msg});
}

var privilegeOptions =  ['Administrator', 'Coordinator', 'Monitor', 'Citizen'];
var accountStatusOptions = ['ACTIVE', 'INACTIVE'];

router.post('/:uid', Session.AdminRequired);
router.post('/:uid', function(req, res) {
    var uid = req.params.uid;
    var o = {};
    o.username = req.body.username;
    o.accountStatus = req.body.accountStatus;
    o.privilege = req.body.privilege;

    // user can not change itself's privilege
    console.log(req.session.user.id);

    if(!o.username || o.username.length === 0) {
        return responseFormatError(res, 'Username could not be empty.');
    }

    if(illegalUsername.indexOf(o.username) >= 0) {
        return responseFormatError(res, 'Username is invalid, please try another');
    }

    if(req.body.password) {
        o.password = req.body.password;
        if(o.password.length < 4) {
            return responseFormatError(res, 'Password should have at least 4 characters');
        }
    }

    if(privilegeOptions.indexOf(o.privilege) < 0) {
        return responseFormatError(res, 'Invalid privilege');
    }

    if(accountStatusOptions.indexOf(o.accountStatus) < 0) {
        return responseFormatError(res, 'Invalid account status');
    }

    // find the number of admins.
    User.findAll({
        where: {
            privilege : "Administrator",
            accountStatus : 'ACTIVE',
        }
    }).then(function(admins){
        User.findOne({
            where: {
                username: o.username,
                id: {
                    $ne: uid
                }
            }
        }).then(function(existUser) {
            if(existUser) {
                return res.status(405).json({msg: "The username has been used."});
            }
            else {
                User.findOne({
                    where : {id: uid}
                }).then(function(user){
                    if(!user) {
                        return res.status(406).json({msg: "The user does not exist"});
                    }
                    else {
                        // at least one admin
                        if(req.session.user.id == uid) {
                            if(o.privilege != 'Administrator' || o.accountStatus == 'INACTIVE') {
                                if (!admins || admins.length <= 1) {
                                    console.log("You are the only Administrator");
                                    return res.status(403).json({msg: "WARNING: You are the only Administrator There should be at least one Administrator"});
                                }
                            }
                        }

                        user.update(o).then(function(data){
                            data.password = undefined;
                            if(data.accountStatus === 'INACTIVE') {
                                UserDict.sendTo(uid, 'become inactive', {});
                            }
                            io.emit('user update', data);
                            return res.status(200).json(data);

                        }, function(){
                            return res.status(440).json({msg: 'db update error'});
                        });
                    }
                });
            }
        });

    });



});

module.exports = router;
