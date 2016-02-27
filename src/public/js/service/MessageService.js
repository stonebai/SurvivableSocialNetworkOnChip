/**
 * Created by Edison on 2016/2/26.
 */
MyApp.angular.factory('MessageService', ['$document', '$http', '$q', 'UserService',
    function ($document, $http, $q, UserService) {

    var pub = {};
    var messageStorage = {};

    pub.getMessages = function(uid) {
        var defer = $q.defer();
        if(messageStorage[uid] !== undefined) {
            defer.resolve(messageStorage[uid]);
            return defer.promise;
        }
        else {
            var q = $http.get("/api/messages/private/" + UserService.currentUser.id + "/" + uid)
                .then(function(data){
                messageStorage[uid] = data.data;
                return messageStorage[uid];
            });

            return q;
        }
    }

    pub.add = function(msg) {
        var myid = UserService.currentUser.id;
        var uid = (msg.sender.id == myid) ? msg.receiver.id : msg.sender.id;
        pub.getMessages(uid).then(function(messages){
            if(messages != null)
               messages.push(msg);
        });
    }

    return pub;

}]);
