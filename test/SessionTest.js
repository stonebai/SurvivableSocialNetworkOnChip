/**
 * Created by baishi on 4/18/16.
 */
var Session = require('../src/models/Session');
var should = require('should');
var User = require('../src/models/User');

describe('loginRequired', function() {
    /**
     * Test if it can refuse unlogined request
     */
    it('refuse login', function(done) {
        var req = {};
        req.session = {};
        var res = {};
        res.status = function(s) {
            return this;
        };
        res.json = function(obj) {
            should.exist(obj);
            done();
        };
        Session.loginRequired(req, res, done);
    });
    /**
     * Test if it can accept logined request
     */
    it('accept login', function(done) {
        var req = {};
        req.session = {};
        req.session.user = {};
        var res = {};
        Session.loginRequired(req, res, done);
    });
});

describe('AdminRequired', function() {

    it('refuse login', function(done) {
        var req = {};
        req.session = {};
        var res = {};
        res.status = function(s) {
            return this;
        };
        res.json = function(obj) {
            should.exist(obj);
            done();
        };
        Session.AdminRequired(req, res, done);
    });

    it('refuse privilage', function(done) {
        var req = {};
        req.session = {};
        req.session.user = {};
        req.session.user.id = 998;
        var res = {};
        res.status = function(s) {
            return this;
        };
        res.json = function(obj) {
            should.exist(obj);
            done();
        };
        Session.AdminRequired(req, res, done);
    });

    it('no user in database', function(done) {
        var req = {};
        req.session = {};
        req.session.user = {};
        req.session.user.id = 998;
        var res = {};
        res.status = function(s) {
            return this;
        };
        res.json = function(obj) {
            should.exist(obj);
            done();
        };
        Session.AdminRequired(req, res, done);
    });

    it('no privilage', function(done) {
        User.create({
            username: 'User4Test',
            password: '1234',
            createdAt: 1234
        }).then(function(user) {
            var req = {};
            req.session = {};
            req.session.user = {};
            req.session.user.id = user.id;
            var res = {};
            res.status = function(s) {
                return this;
            };
            res.json = function(obj) {
                should.exist(obj);
                done();
            };
            Session.AdminRequired(req, res, done);
        });
    });

    it('accept admin', function(done) {
        var req = {};
        req.session = {};
        req.session.user = {};
        req.session.user.id = 1;
        var res = {};
        res.status = function(s) {
            return this;
        };
        res.json = function(obj) {};
        Session.AdminRequired(req, res, done);
    });

    after(function(done) {
        User.destroy({
            where: {
                username: 'User4Test'
            }
        }).then(function() {
            done();
        });
    });
});

describe('CoordinatorRequired', function() {
    it('accept request', function(done) {
        var req = {};
        req.session = {};
        req.session.user = {};
        req.session.user.id = 1;
        var res = {};
        res.status = function(s) {
            return this;
        };
        res.json = function(obj) {};
        Session.CoordinatorRequired(req, res, done);
    });
});

describe('MonitorRequired', function() {
    it('accept request', function(done) {
        var req = {};
        req.session = {};
        req.session.user = {};
        req.session.user.id = 1;
        var res = {};
        res.status = function(s) {
            return this;
        };
        res.json = function(obj) {};
        Session.MonitorRequired(req, res, done);
    });
});

describe('login', function() {
    it('add online user', function(done) {
        var req = {};
        req.session = {};
        req.session.user = {};
        req.session.user.id = 998;
        var user = {};
        user.id = 998;
        user.username = 'User4Test';
        Session.login(req, user);
        Session.onlineUser[998].count.should.eql(0);
        done();
    });
});

describe('logout', function() {
    it('remove online user', function(done) {
        var req = {};
        req.session = {};
        req.session.user = {};
        req.session.user.id = 998;
        req.session.destroy = function() {

        };
        var user = {};
        user.id = 998;
        user.username = 'User4Test';
        Session.login(req, user);
        Session.logout(req);
        should.not.exist(Session.onlineUser[998]);
        done();
    });
});