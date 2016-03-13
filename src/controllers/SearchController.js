/**
 * Created by Edison on 2016/3/10.
 */
var router = require('express').Router();
var User = require('../models/User');
var Session = require('../models/Session');
var io = require('../socket.js');
var UserDict = require('../UserDict.js');
var Announcement = require('../models/Announcement');
var PublicMessage = require('../models/PublicMessage');
var PrivateMessage = require('../models/PrivateMessage');



var stopwords = {};


(function(){

    var stopword_str = "a,able,about,across,after,all,almost,also,am,among,an,and,any,are," +
        "as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either," +
        "else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how," +
        "however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might," +
        "most,must,my,neither,no,nor,not,of,off,often,on,only,or,other,our,own," +
        "rather,said,say,says,she,should,since,so,some,than,that,the,their,them," +
        "then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when," +
        "where,which,while,who,whom,why,will,with,would,yet,you,your";

    var words = stopword_str.split(',');
    for(var i = 0; i < words.length; i++) {
        var word = words[i];
        stopwords[word] = 1;
    }

})();


function isStopWord(keyword) {
    return stopwords[keyword] == 1;
}


/* Register or Login API */
router.get('/:keyword/:context/:count', function(req, res){
    //validate the request body
    var keyword = req.params.keyword;
    var context = req.params.context;
    var count = req.params.count;

    var searchContexts = {
        UserName : {model: User, field: 'username', 'order': 'username'},
        Status : {model: User, field: 'lastStatusCode', 'order': 'username'},
        Announcement : {model: Announcement, field: 'content', order: 'timestamp DESC'},
        PublicMessage: {model: PublicMessage, field: 'content', order: 'postedAt DESC'},
        PrivateMessage: {model: PrivateMessage, field: 'content', order: 'postedAt DESC'},
    }

    if(typeof keyword === 'undefined' || typeof context === 'undefined' ||
        typeof count === 'undefined') {
        res.status(422).end();
    }
    else {
        var M = searchContexts[context].model;
        var field = searchContexts[context].field;
        var order = searchContexts[context].order;

        var clause = {
            where : {
                $or : []
            },
        };

        var re = /\s+/;
        var keys = keyword.split(re);
        for(var i = 0; i < keys.length; i++) {
            if(!isStopWord(keys[i])) {
                var condition = {};
                condition[field] = {$like: '%' + keys[i] + '%'};
                clause.where.$or.push(condition);
            }
        }

        if(clause.where.$or.length == 0) {
            return res.status(200).json([]);
        }

        //clause.where[field] = {$like: '%' + keyword + '%'};
        clause.order = order;
        clause.limit = count;

        M.findAll(clause).then(function(results){
            res.status(200).json(results);
        }, function(e){
            res.status(401).json(e);
        });
    }
});

module.exports = router;