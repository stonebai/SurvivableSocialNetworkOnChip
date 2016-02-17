/**
 * Created by baishi on 2/11/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('messages', '', '', {
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
});

var Message = sequelize.define('message', {
    author: {
        type: Sequelize.STRING,
        field: 'author'
    },
    content: {
        type: Sequelize.STRING,
        field: 'content'
    },
    timestamp: {
        type: Sequelize.DATE,
        field: 'timestamp'
    }
}, {
    timestamps: false,
    tableName: 'publicmessages'
});

module.exports = Message;