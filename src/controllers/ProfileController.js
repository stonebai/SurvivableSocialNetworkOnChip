/**
 * Created by Edison on 2016/4/4.
 */
/* Register or Login API */
var router = require('express').Router();
var Session = require('../models/Session');
var User = require('../models/User');
var formidable = require('formidable');
var fs = require('fs');
var AVATAR_UPLOAD_FOLDER = '/avatar/';

function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

router.get('/:username', Session.loginRequired);
router.get('/:username', function(req, res) {
    //validate the request body
    var username = req.params.username;
    if (typeof username === 'undefined' || username === '') {
        username = req.session.user.username;
    }

    var attributes = ['id', 'username',
        ['lastStatusCode','status'], 'gender', 'twitter',
        'company', 'age', 'phone', 'email', 'avatar'];

    User.findOne({
        attributes: attributes,
        where: {
            username: username,
        }
    }).then(function (user) {
        if (!user) {
            return res.status(404).end();
        }
        else {
            return res.status(200).json(user);
        }
    });
});

router.post('/', Session.loginRequired);
router.post('/', function(req, res) {
    //validate the request body
    var o = {};

    var userID = req.session.user.id;
    var age = req.body.age;
    if(!isNaN(parseInt(age))) {
        o.age = parseInt(age);
    }

    var gender = req.body.gender;
    if (gender=='Male' || gender=='Female') {
        o.gender = gender;
    }

    o.company = req.body.company;
    o.twitter = req.body.twitter;

    var email = req.body.email;
    if(email && validateEmail(email)) {
        o.email = email;
    }

    o.phone = req.body.phone;

    User.findOne({
        where: {
            id: userID,
        }
    }).then(function(user) {
        if (!user) {
            return res.status(403).end();
        } else {
            user.update(o).then(function(data){
                return res.status(200).json(data);
            }, function(){
                return res.status(405).end();
            });
        }
    });
});


function generateRandomFileName() {
    var s = "";
    var str = "abcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 12; i++) {
        var index = Math.floor(Math.random() * str.length);
        s += str[index];
    }
    return s;
}

router.post('/avatar', Session.loginRequired);
router.post('/avatar', function(req, res) {

    console.log('file uploadDir');

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;

    form.parse(req, function(err, fields, files) {

        console.log('pasre');

        if (err) {
            res.locals.error = err;
            res.status(423).json({'err': err});

            return;
        }

        var extName = '';  //postfix
        switch (files.file.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            res.locals.error = 'only support png and jpg';
            res.status(425).json({msg: 'only support png and jpg'});
            return;
        }

        var avatarName = generateRandomFileName() + '.' + extName;
        var newPath = form.uploadDir + avatarName;

        console.log('upload avatar: ' + newPath);
        fs.renameSync(files.file.path, newPath);  //

        var userID = req.session.user.id;
        User.findOne({
            where: {
                id: userID,
            }
        }).then(function(user) {
            if (!user) {
                return res.status(403).end();
            } else {
                user.update({
                    avatar: newPath,
                }).then(function(data){
                    return res.status(200).json({
                        url: newPath,
                    });
                }, function(){
                    return res.status(405).end();
                });
            }
        });

    });
});

module.exports = router;