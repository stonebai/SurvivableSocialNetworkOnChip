var Sequelize = require('sequelize');
var sequelize = new Sequelize('request_statistic', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
});


var RequestStatistic = sequelize.define('request_statistic', {
    date: {
        field: 'date',
        type: Sequelize.STRING
    },

    type: {
        field: 'type',
        type: Sequelize.STRING
    },

    count: {
        field: 'count',
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false,
    tableName: 'request_statistic'
});

RequestStatistic.recordToFile = function(record){
    RequestStatistic.findOne({
        where: {
            date: record.date,
            type: record.type
        }
    }).then(function(item){
        if(!item){
            RequestStatistic.create({
                date: record.date,
                type: record.type,
                count: 1
            });
        }else{
            var count = item.count + 1;
            item.updateAttributes({
                count: count
            });
        }
    });
};


RequestStatistic.record = function(req, res, next){
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var date = year + "-" + month + "-" + day;

    record = {
        type: req.baseUrl,
        date: date
    }

    RequestStatistic.recordToFile(record);

    next();
}

module.exports = RequestStatistic;
