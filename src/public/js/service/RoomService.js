/**
 * Created by baishi on 3/26/16.
 */
MyApp.angular.factory('RoomService', ['$document', '$http', function($document, $http) {
    
    var roomObject = {};
    var roomList = [];

    roomObject.addCreatorRooms = function(rooms) {
        for(var i=0;i<rooms.length;i++) {
            roomObject.addCreatorRoom(rooms[i]);
        }
    };

    roomObject.addMemberRooms = function(mems) {
        for(var i=0;i<mems.length;i++) {
            roomObject.addMemberRoom(mems[i]);
        }
    };

    roomObject.addCreatorRoom = function(room) {
        var tmp = {};
        tmp.roomname = room.roomname;
        tmp.isCreator = true;
        tmp.isMember = false;
        roomList.push(tmp);
    };

    roomObject.addMemberRoom = function(mem) {
        var tmp = {};
        tmp.roomname = mem.roomname;
        tmp.isCreator = false;
        tmp.isMember = true;
        roomList.push(tmp);
    };

    roomObject.getAll = function() {
        return roomList;
    };

    roomObject.getMessages = function(roomname, callback) {
        $http.get('/roommessage/' + roomname).success(function(data, status) {
            if(status==200) {
                callback(data);
            }
        });
    };

    return roomObject;

}]);