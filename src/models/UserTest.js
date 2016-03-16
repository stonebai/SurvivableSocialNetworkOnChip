/**
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('users', '', '', {
    logging: false,
    dialect: 'sqlite',
    storage: __dirname + '/../db/test.db'
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
    }
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
}

module.exports = User;
