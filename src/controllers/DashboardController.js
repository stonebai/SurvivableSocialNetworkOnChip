var router = require('express').Router();
var Session = require('../models/Session');

var RequestRecord = require('../utils/RequestRecord');

router.get('/request', function(req, res){
    var ret = {};
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate() - 6;


    query = [];
    for(i = 0; i < 7; i++){
        var date = year + "-" + month + "-" + (day + i);
        query.push(date);
    }

    console.log(query);

    RequestRecord.findAll({
        where: {
            date: {
                $in: query
            }
        }
    }).then(function(items){
        if(items){
            res.status(200).json(items.sort(function(a, b){
                return a.date > b.date;
            }));
        }
    });
});

module.exports = router;
