var router = require('express').Router();
var Session = require('../models/Session');

var RequestRecord = require('../utils/RequestRecord');

router.get('/request', function(req, res){
    res.status(200).json(RequestRecord.retrieve());
});

module.exports = router;
