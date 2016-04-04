/**
 * Created by baishi on 3/24/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('rooms', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
});

var Room = sequelize.define('room', {
    roomname: {
        field: 'roomname',
        type: Sequelize.STRING
    },
    creatorname: {
        field: 'creatorname',
        type: Sequelize.STRING
    }
}, {
    timestamp: false,
    tableName: 'room'
});

module.exports = Room;