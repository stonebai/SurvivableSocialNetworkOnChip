/**
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('private_messages', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/test.db'
});

var PrivateMessage = sequelize.define('private_message', {
    content: {
        field: 'content',
        type: Sequelize.STRING
    },
    author: {
        field: 'author',
        type: Sequelize.INTEGER
    },
    target: {
        field: 'target',
        type: Sequelize.INTEGER,
    },
    postedAt: {
        field: 'postedAt',
        type: Sequelize.INTEGER,
    }
}, {
    timestamps: false,
    tableName: 'private_message_test'
});

module.exports = PrivateMessage;
