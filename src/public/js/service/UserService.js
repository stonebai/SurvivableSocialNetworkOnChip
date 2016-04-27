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

    pub.getByUsername = function(username) {
        for(var i in users) {
            if(users[i].username === username) {
                return users[i];
            }
        }
        return null;
    }

    pub.add = function(u) {
        var id = u.id;
        users[id] = u;
    }

    pub.update = function(u) {
        var id = u.id;
        users[id] = u;
        if(id === this.currentUser.id) {
            this.currentUser = u;
        }
    }

    pub.getAll = function() {
        return users;
    }

    pub.getActiveUsers = function() {
        var activeUsers = [];
        for(var i in users) {
            var u = users[i];
            if(u.accountStatus === 'ACTIVE') {
                activeUsers.push(u);
            }
        }
        return activeUsers;
    }

    pub.isAdmin = function() {
        if(!this.currentUser)
            return false;

        return this.currentUser.privilege === 'Administrator';
    }

    pub.isCoordinator = function() {
        if(!this.currentUser)
            return false;
        return this.currentUser.privilege === 'Coordinator' || this.currentUser.privilege === 'Administrator';
    }

    pub.isMonitor = function() {
        if(!this.currentUser)
            return false;
        return this.currentUser.privilege === 'Monitor' || this.currentUser.privilege === 'Administrator';
    }

    pub.currentUser = null;

    return pub;

}]);


