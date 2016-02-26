var session = require("express-session")

var Session = {
    onlineUser: {}
};

/* Session check for API */
Session.loginRequired = function(req, res, next){
    if(!req.session.user){
        res.status(401).json({});
    }else{
        next();
    }
};


Session.login = function(req, user){
    req.session.user = {
        username: user.username
    };

    Session.onlineUser[req.session.user.username] = {
        //used for the socket.io
        count: 0,
    };
};


Session.logout = function(req){
    delete Session.onlineUser[req.session.user.username];
    req.session.user = null;
};

module.exports = Session
