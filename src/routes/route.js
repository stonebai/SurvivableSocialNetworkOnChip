/**
 * Created by baishi on 2/6/16.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var User = require(path.join(__dirname, '../models/user'));



router.get('/', function (req, res, next) {
    
    res.sendFile(path.join(__dirname, '../views/index.html'));
    
    /*
    if(req.session.username!=null && req.session.password!=null) {
        User.findOne({
            where: {
                username: req.session.username
            }
        }).then(function(user) {
            if(user!=null && user.password==req.session.password) {
                res.sendFile(path.join(__dirname, '../views/index.html'));
            }
            else {
                res.redirect('/login');
            }
        });
    }
    else {
        res.redirect('/login');
    }
     */
});

router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;