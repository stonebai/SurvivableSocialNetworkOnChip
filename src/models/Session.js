var session = require("express-session")
var User = require('./User.js');

var Session = {
    onlineUser: {}
};

/* Session check for API */
Session.loginRequired = function(req, res, next){
    if(!req.session.user) {
        res.status(401).json({});
    }
    else {
        next();
    }
};

function checkPrivilege(privilege, req, res, next) {
    if (!req.session.user) {
        res.status(401).json({});
    } else {
        var uid = req.session.user.id;
        User.findOne({
            where: {
                id: uid,
            }
        }).then(function (user) {
            if (!user) {
                res.status(401).json({});
            }
            else {
                var valid = false;
                if(Array.isArray(privilege)) {
                    if(privilege.indexOf(user.privilege) >= 0) {
                        valid = true;
                    }
                }
                else {
                    if(user.privilege === privilege) {
                        valid = true;
                    }
                }

                if(valid) {
                    next();
                }
                else {
                    res.status(441).json({msg: 'No privilege'});
                }
            }
        });
    }
}

Session.AdminRequired = function(req, res, next) {
    return checkPrivilege('Administrator', req, res, next);
};

Session.CoordinatorRequired = function(req, res, next) {
    return checkPrivilege(['Administrator', 'Coordinator'], req, res, next);
};

Session.MonitorRequired = function(req, res, next) {
    return checkPrivilege(['Administrator', 'Monitor'], req, res, next);
};

Session.login = function(req, user){
    req.session.user = {
        id: user.id,
        name: user.username
    };

    Session.onlineUser[req.session.user.id] = {
        //used for the socket.io
        count: 0
    };
};


Session.logout = function(req){
    delete Session.onlineUser[req.session.user.id];
    req.session.user = null;
    req.session.destroy();
};

module.exports = Session;
