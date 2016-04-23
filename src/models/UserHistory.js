/**
 * Created by baishi on 4/13/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('userhistories', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
});

var UserHistory = sequelize.define('userhistory', {
    timestamp: {
        field: 'timestamp',
        type: Sequelize.DATE
    },
    username: {
        field: 'username',
        type: Sequelize.STRING
    },
    type: {
        field: 'type',
        type: Sequelize.INTEGER
    },
    content: {
        field: 'content',
        type: Sequelize.STRING
    }
}, {
    timestamps: false,
    tableName: 'user_history'
});

module.exports = UserHistory;