/**
 * Created by yuanyuan on 4/1/16.
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('agencyContactRequests', '', '', {
    dialect: 'sqlite',
    logging: false,
    storage: __dirname + '/../db/all.db'
});

var AgencyContactRequest = sequelize.define('AgencyContactRequest', {
    author: {
        type: Sequelize.STRING,
        field: 'author'
    },

    target: {
        type: Sequelize.STRING,
        field: 'target'
    },

    content: {
        type: Sequelize.STRING,
        field: 'content'
    },

    state: {
        type: Sequelize.BOOLEAN,
        field: 'state'
    }
},{
    tableName: 'agencyContactRequests'
});

AgencyContactRequest.delete = function(id) {
    this.destroy({
        where: {
            id : id
        }
    });
};

module.exports = AgencyContactRequest;
