
/**
 * Created by yuanyuan on 4/1/16.
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('agencyContact', '', '', {
    dialect: 'sqlite',
    logging: false,
    storage: __dirname + '/../db/all.db'
});

var AgencyContact = sequelize.define('AgencyContact', {
    author: {
        type: Sequelize.STRING,
        field: 'author'
    },

    target: {
        type: Sequelize.STRING,
        field: 'target'
    }
},{
    tableName: 'agencyContact'
});

module.exports = AgencyContact;
