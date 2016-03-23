/**
 * Created by baishi on 2/6/16.
 */
var User = require('./models/User.js');
var PublicMessage = require('./models/PublicMessage.js');
var PrivateMessage = require('./models/PrivateMessage.js');
var Announcement = require('./models/Announcement.js');

User.sync({force: true});
PublicMessage.sync({force: true});
PrivateMessage.sync({force: true});
Announcement.sync({force: true});

var PrivateMessageTest = require('./models/PrivatemessageTest.js');
var PublicMessageTest = require('./models/PublicMessageTest.js');
var AnnoouncementTest = require('./models/AnnouncementTest.js');
var UserTest = require('./models/UserTest');

PrivateMessageTest.sync({force: true});
PublicMessageTest.sync({force: true});
AnnoouncementTest.sync({force: true});
UserTest.sync({force: true});