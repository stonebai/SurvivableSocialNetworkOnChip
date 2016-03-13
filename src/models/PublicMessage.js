/**
 * Created by baishi on 2/11/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('public_messages', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
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
        field: 'postAt',
        type: Sequelize.DATE,
    }
}, {
    timestamps: false,
    tableName: 'public_message'
});


module.exports = PublicMessage;
