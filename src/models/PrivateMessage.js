/**
 * Created by Edison on 2016/2/26.
 */
var Message = sequelize.define('message', {
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
    }
}, {
    timestamps: false,
    tableName: 'publicmessages'
});
