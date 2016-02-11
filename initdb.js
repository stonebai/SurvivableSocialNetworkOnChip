/**
 * Created by baishi on 2/6/16.
 */
var User = require('./models/user');

User.sync({force: true});