/**
 * Created by baishi on 2/6/16.
 */
var User = require('./models/user');
var PublicMessage = require('./models/PublicMessage');
var PrivateMessage = require('./models/PrivateMessage');
var Announcement = require('./models/announcement');

User.sync({force: true});
PublicMessage.sync({force: true});
PrivateMessage.sync({force: true});
Announcement.sync({force: true});
