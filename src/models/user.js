/**
 * Created by baishi on 2/6/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('users', '', '', {
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
});

/**
 * Define the User model here
 * @type {Model}
 */
var User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        field: 'username'
    },
    password: {
        type: Sequelize.STRING,
        field: 'password'
    }
}, {
    timestamps: false,
    tableName: 'login'
});

module.exports = User;