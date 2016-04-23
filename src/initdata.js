/**
 * Created by Edison on 2016/3/10.
 */

var User = require('./models/User');


function makeAdminUser(){
    User.create({
	    username: 'SSNAdmin',
	    password: 'admin',
	    createdAt: new Date(),
	    privilege: 'Administrator',
	}).then(function(user){
		User.findOne({
			username: 'SSNAdmin'
		    }).then(function(user){
			    if(user == null){
				throw "no addmin user password added";
			    }
			    console.log("an addmin user was created with password:"+user.password);
			})
	    });
}

module.exports.makeAdminUser = makeAdminUser;

makeAdminUser();
