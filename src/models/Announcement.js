/**
 * Created by baishi on 2/24/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('announcements', '', '', {
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
});

var Announcement = sequelize.define('announcement', {
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
    },
    location: {
        type: Sequelize.STRING,
        field: 'location'
    }
}, {
    timestamps: false,
    tableName: 'announcements'
});

module.exports = Announcement;