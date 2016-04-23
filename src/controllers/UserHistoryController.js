/**
 * Created by baishi on 4/13/16.
 */
var router = require('express').Router();
var Session = require('../models/Session');
router.UserHistroy = require('../models/UserHistory');

router.get('/:userName', Session.loginRequired);
router.get('/:userName', function(req, res) {
    router.UserHistroy.findAll({
        where: {
            username: req.params.userName
        }
    }).then(function(histories) {
        res.status(200).json(histories);
    });
});

module.exports = router;