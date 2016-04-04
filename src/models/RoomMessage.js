/**
 * Created by baishi on 4/1/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('room_messages', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
});

var RoomMessage = sequelize.define('room_message', {
    content: {
        field: 'content',
        type: Sequelize.STRING
    },
    author: {
        field: 'author',
        type: Sequelize.STRING
    },
    roomname: {
        field: 'roomname',
        type: Sequelize.STRING,
    },
    postedAt: {
        field: 'postAt',
        type: Sequelize.DATE,
    }
}, {
    timestamps: false,
    tableName: 'room_message'
});

module.exports = RoomMessage;
