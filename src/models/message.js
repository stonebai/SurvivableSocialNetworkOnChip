/**
 * Created by baishi on 2/11/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('messages', '', '', {
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
});


var Message = sequelize.define('message', {
    content: {
        field: 'content',
        type: Sequelize.STRING
    },
    author: {
        field: 'author',
        type: Sequelize.STRING
    },
    messageType: {
        field: 'messageType',
        type: Sequelize.ENUM,
        values: ['CHAT', 'WALL']
    },
    target: {
        field: 'target',
        type: Sequelize.STRING,
    },
    postedAt: {
        field: 'postAt',
        type: Sequelize.INTEGER,
    }
}, {
    timestamps: false,
    tableName: 'message'
});


module.exports = Message;
