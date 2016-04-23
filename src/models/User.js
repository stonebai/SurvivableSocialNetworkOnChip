/**
 * Created by baishi on 2/6/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('users', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/all.db'
});

/**
 * Define the User model here
 * @type {Model}
 */
var User = sequelize.define('user', {
    username: {
        field: 'username',
        type: Sequelize.STRING,
    },
    lat: {
	    field: 'lat',
	    type: Sequelize.FLOAT,
	    defaultValue: 40.442403
    },
    lng: {
	    field: 'lng',
	    type:Sequelize.FLOAT,
	    defaultValue: -79.9477453
    },
    password: {
        field: 'password',
        type: Sequelize.STRING,
    },
    createdAt: {
        field: 'createdAt',
        type: Sequelize.INTEGER,
    },
    updatedAt: {
        field: 'updatedAt',
        type: Sequelize.INTEGER,
    },
    lastLoginAt: {
        field: 'lastLoginAt',
        type: Sequelize.INTEGER,
    },
    lastStatusCode: {
        field: 'lastStatusCode',
        type: Sequelize.ENUM,
        values: ['GREEN', 'YELLOW', 'RED'],
        defaultValue: 'GREEN'
    },
    accountStatus: {
        field: 'accountStatus',
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'INACTIVE'],
        defaultValue: 'ACTIVE'
    },
    //username, age, status, location, gender, twiiter, phone, email, avatar image
    avatar: {
        field: 'avatar',
        type: Sequelize.STRING,
    },
    age: {
        field: 'age',
        type: Sequelize.INTEGER,
    },
    company: {
        field: 'company',
        type: Sequelize.STRING,
    },
    gender: {
        field: 'gender',
        type: Sequelize.STRING,
    },
    twitter: {
        field: 'twitter',
        type: Sequelize.STRING,
    },
    phone: {
        field: 'phone',
        type: Sequelize.STRING,
    },
    email: {
        field: 'email',
        type: Sequelize.STRING,
    },
    privilege: {
        field: 'privilege',
        type: Sequelize.ENUM,
        values: ['Administrator', 'Coordinator', 'Monitor', 'Citizen'],
        defaultValue: 'Citizen'
    },

}, {
    timestamps: false,
    tableName: 'user'
});

User.delete = function(id){
    this.destroy({
        where: {
            id: id
        }
    });
};

module.exports = User;
