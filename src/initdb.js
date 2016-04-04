/**
 * Created by baishi on 2/6/16.
 */
var User = require('./models/User');
var PublicMessage = require('./models/PublicMessage');
var PrivateMessage = require('./models/PrivateMessage');
var Announcement = require('./models/Announcement');
var Room = require('./models/Room');
var Member = require('./models/Member');
var RoomMessage = require('./models/RoomMessage');

User.sync({force: true});
PublicMessage.sync({force: true});
PrivateMessage.sync({force: true});
Announcement.sync({force: true});
Room.sync({force: true});
Member.sync({force: true});
RoomMessage.sync({force: true});

var PrivateMessageTest = require('./models/PrivatemessageTest');
var PublicMessageTest = require('./models/PublicMessageTest');
var AnnoouncementTest = require('./models/AnnouncementTest');
var UserTest = require('./models/UserTest');

PrivateMessageTest.sync({force: true});
PublicMessageTest.sync({force: true});
AnnoouncementTest.sync({force: true});
UserTest.sync({force: true});