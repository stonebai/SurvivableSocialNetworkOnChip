/**
 * Created by Edison on 2016/2/26.
 */
MyApp.angular.factory('MessageService', ['$document', '$http', '$q', 'UserService',
    function ($document, $http, $q, UserService) {

    var pub = {};
    var messageStorage = {};

    pub.getMessages = function(uid) {
        var targetUserName = UserService.getById(uid).username;
        var q = $http.get("/messages/private/" + UserService.currentUser.username + "/" + targetUserName)
            .then(function(data){
            messageStorage[uid] = data.data;
            return messageStorage[uid];
        });

        return q;
    }

    pub.add = function(msg) {
        var myid = UserService.currentUser.id;
        var uid = (msg.author == myid) ? msg.target : msg.author;
        pub.getMessages(uid).then(function(messages){
            if(messages != null)
               messages.push(msg);
        });
    }

    return pub;

}]);
