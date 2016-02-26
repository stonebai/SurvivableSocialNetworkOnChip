var session = require("express-session")

var Session = {

};

/* Session check for API */
Session.loginRequired = function(req, res, next){
    if(!req.session.user){
        res.redirect("/login");
    }else{
        next();
    }
};


Session.login = function(req, user){
    req.session.user = {
        username: user.username
    };

    //Todo: add user to online list
}


Session.logout = function(req){
    req.session.user = null;

    //Todo: remove the user from online list
}

module.exports = Session
