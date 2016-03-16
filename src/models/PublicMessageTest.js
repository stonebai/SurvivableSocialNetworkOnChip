/**
 * Created by baishi on 3/11/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('public_messages', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/test.db'
});

var PublicMessage = sequelize.define('public_message', {
    content: {
        field: 'content',
        type: Sequelize.STRING
    },
    author: {
        field: 'author',
        type: Sequelize.INTEGER
    },
    postedAt: {
        field: 'postedAt',
        type: Sequelize.DATE,
    }
}, {
    timestamps: false,
    tableName: 'public_message'
});


module.exports = PublicMessage;
