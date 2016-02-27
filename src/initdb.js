/**
 * Created by baishi on 2/6/16.
 */
var User = require('./models/user');
var Message = require('./models/message');
var Announcement = require('./models/announcement');

User.sync({force: true});
Message.sync({force: true});
Announcement.sync({force: true});