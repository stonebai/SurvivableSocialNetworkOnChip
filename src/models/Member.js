/**
 * Created by baishi on 3/24/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('members', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
});

var Member = sequelize.define('member', {
    roomname: {
        field: 'roomname',
        type: Sequelize.STRING
    },
    username: {
        field: 'username',
        type: Sequelize.STRING
    }
}, {
    timestamp: false,
    tableName: 'member'
});

module.exports = Member;