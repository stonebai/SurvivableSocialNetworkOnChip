/**
 * Created by baishi on 3/12/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('announcements', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/test.db'
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

Announcement.delete = function(id) {
    this.destroy({
        where: {
            id: id
        }
    });
};

module.exports = Announcement;