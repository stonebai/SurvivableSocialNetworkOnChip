var fs = require("fs");

var RequestRecord = {
    recordDir: __dirname + "/../../statistic/",
    recordExt: ".stat"
}


/*
record = {
    type
    method
    date
}
*/
RequestRecord.recordToFile = function(record){
    var filename = RequestRecord.recordDir + record.date +
            RequestRecord.recordExt;

    var obj;
    if(fs.existsSync(filename)){
        obj = JSON.parse(fs.readFileSync(filename).toString());
    }else{
        obj = {}
        obj[record.type] = 0;
    }

    obj[record.type] += 1;

    fs.writeFile(filename, JSON.stringify(obj), function(err){});
}


RequestRecord.retrieve = function(){
    var ret = {};
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate() - 6;

    for(i = 0; i < 7; i++){
        var date = year + "-" + month + "-" + (day + i);
        var filename = RequestRecord.recordDir + date +
            RequestRecord.recordExt;

        if(fs.existsSync(filename)){
            var str = fs.readFileSync(filename).toString();
            var obj = JSON.parse(str);
            ret[date] = obj;
        }
    }

    return ret;
}


RequestRecord.record = function(req, res, next){
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var date = year + "-" + month + "-" + day;

    record = {
        type: req.baseUrl,
        date: date
    }

    RequestRecord.recordToFile(record);

    next();
}

module.exports = RequestRecord;
