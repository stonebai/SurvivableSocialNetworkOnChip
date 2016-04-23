/**
 * Created by baishi on 2/6/16.
 * Modify by tdecker on 4/11/16
 */

function initdb() {
    var User = require('./models/User');
    var PublicMessage = require('./models/PublicMessage');
    var PrivateMessage = require('./models/PrivateMessage');
    var Announcement = require('./models/Announcement');
    var Room = require('./models/Room');
    var Member = require('./models/Member');
    var RoomMessage = require('./models/RoomMessage');
    var AgencyContact = require('./models/AgencyContact');
    var AgencyContactRequest = require('./models/AgencyContactRequest');
    var RequestRecord = require('./utils/RequestRecord');
    var UserHistroy = require('./models/UserHistory');

    User.sync({force: true});
    PublicMessage.sync({force: true});
    PrivateMessage.sync({force: true});
    Announcement.sync({force: true});
    Room.sync({force: true});
    Member.sync({force: true});
    RoomMessage.sync({force: true});
    AgencyContact.sync({force: true});
    AgencyContactRequest.sync({force: true});
    RequestRecord.sync({force: true});
    UserHistroy.sync({force: true});
}

initdb();
