var router = require('express').Router();
var User = require('../models/User');
var Session = require('../models/Session');
var Message = require('../models/PublicMessage');
var formidable = require('formidable'),
      fs = require('fs');

var AVATAR_UPLOAD_FOLDER = '/avatar/';

router.Message = require('../models/PublicMessage');

function generateRandomFileName() {
    var s = "";
    var str = "abcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 12; i++) {
        var index = Math.floor(Math.random() * str.length);
        s += str[index];
    }
    return s;
}

router.post('/', Session.loginRequired);
router.post('/', function(req, res) {
    
    console.log('file uploadDir');

  var form = new formidable.IncomingForm();   //create from 
      form.encoding = 'utf-8';        // set encoding
      form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;     //set the Foloder
      form.keepExtensions = true;     // keep postfix
      form.maxFieldsSize = 2 * 1024 * 1024;   // set the size

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
              // res.render('index', { title: TITLE });
              res.status(425).json({msg: 'only support png and jpg'});
              return;                   
        }

        var avatarName = generateRandomFileName() + '.' + extName;
        var newPath = form.uploadDir + avatarName;

        console.log(newPath);
        fs.renameSync(files.file.path, newPath);  //
        return res.status(200).json({
            url: newPath,
        });
    });
   
});

module.exports = router;
