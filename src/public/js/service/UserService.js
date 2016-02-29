/**
 * Created by Edison on 2016/2/26.
 */
MyApp.angular.factory('UserService', ['$document', '$http', function ($document, $http) {

    var pub = {};

    var users = {};

    pub.addUsers = function(data) {
        for(var i = 0; i < data.length; i++) {
            pub.add(data[i]);
        }
    }

    pub.getById = function(id) {
        return users[id];
    }

    pub.add = function(u) {
        var id = u.id;
        users[id] = u;
    }

    pub.getAll = function() {
        return users;
    }

    pub.currentUser = null;

    return pub;

}]);


