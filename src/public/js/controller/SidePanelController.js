/**
 * Created by Edison on 2016/2/25.
 */

MyApp.angular.controller('SidePanelController',
    ['$scope', '$http', 'BootService', 'UserService', 'RoomService',
        function ($scope, $http, BootService, UserService, RoomService) {

            var fw7 = MyApp.fw7.app;
            var $$ = Dom7;

            $scope.users = [];
            $scope.username = "";
            $scope.rooms = [];

            $scope.openPage = function(pageName) {
                BootService.openPage(pageName);
            };

            $scope.openPrivateChat = function(user) {
                fw7.closePanel();
                BootService.openPage('private_chat', user.id);
            };

            $scope.openRoom = function(room) {
                BootService.openPage('room_chat', room);
            };

            $scope.logout = function() {
                MyApp.fw7.app.confirm("Do you want to logout?", "App Alert", function(){
                    $http.delete("/users/logout", {}).success(function(data, status){
                        if(status == 204) {
                            fw7.closePanel();
                            BootService.trigger('logout');
                        }
                    });
                });
            };

            $scope.isMonitor = function() {
                return UserService.isMonitor();
            }

            function updateUserList() {
                var privilege = UserService.currentUser.privilege;
                var users = [];
                if(privilege === 'Administrator') {
                    users = UserService.getAll();
                } else {
                    users = UserService.getActiveUsers();
                }

                $scope.users = [];
                var offlineUsers = [];
                for(var i in users) {
                    if(users[i].id != UserService.currentUser.id) {
                        if (users[i].online) {
                            $scope.users.push(users[i]);
                        } else {
                            offlineUsers.push(users[i]);
                        }
                    }
                }

                $scope.users.sort(function(a, b){
                    return a.username > b.username;
                });

                offlineUsers.sort(function(a,b ){
                    return a.username > b.username;
                });

                for(var i in offlineUsers) {
                    $scope.users.push(offlineUsers[i]);
                }
            }

            function updateRoomList() {
                var rooms = RoomService.getAll();
                rooms.sort(function(a, b) {
                    if(a.isCreator && b.isCreator) return a.roomname - b.roomname;
                    if(a.isMember && b.isMember) return a.roomname - b.roomname;
                    if(a.isCreator) return -1;
                    if(b.isCreator) return 1;
                    return a.roomname - b.roomname;
                });
                $scope.rooms = [];
                for(var i=0;i<rooms.length;i++) {
                    $scope.rooms.push(rooms[i]);
                }
            }

            function isSelfContact(contacts) {
                var username = UserService.currentUser.username;
                //var contacts = user.contacts;
                for(var i = 0; i < contacts.length; i++) {
                    if(contacts[i].target == username || contacts[i].author == username) {
                        return true;
                    }
                }
                return false;
            }

            BootService.addEventListener('login', function(){
                $scope.username = UserService.currentUser.username;
                updateUserList();
                updateRoomList();

                var socket = MyApp.socket;
                socket.on('status change', function(data){
                    console.log("STATUS CHANGE");
                    console.log(data);

                    var u = data.user;
                    var user = UserService.getById(u.id);
                    user.lastStatusCode = u.lastStatusCode;
                    $scope.$apply();

                    MyApp.fw7.app.addNotification({
                        title: 'Status Change',
                        subtitle: u.username + "changed status to <strong>" + user.lastStatusCode + "</strong>",
                        hold : 10000,
                        media: '<i class="icon icon-f7"></i>',
                        closeOnClick : true,
                    });

                    if(isSelfContact(data.contacts)) {
                        //sound.
                        var audio = new Audio("/public/raw/1.wav");
                        audio.play();
                    }

                });

                socket.on("user update", function(u){
                    UserService.update(u);
                    updateUserList();
                    $scope.$apply();
                });

                socket.on('become inactive', function(){
                    fw7.alert('Your account status becomes INACTIVE! You have to logout now!',
                        'App Alert', function(){
                            $http.delete("/users/logout", {}).success(function(data, status){
                                if(status == 204) {
                                    fw7.closePanel();
                                    BootService.trigger('logout');
                                }
                            });
                        });
                });

                socket.on("user enter", function(u){
                    if(UserService.getById(u.id) == null || UserService.getById(u.id).online == false) {
                        u.online = true;
                        UserService.add(u);
                        updateUserList();
                        $scope.$apply();
                        MyApp.fw7.app.addNotification({
                            title: 'New User Joined in',
                            subtitle: u.username,
                            hold : 10000,
                            media: '<i class="icon icon-f7"></i>',
                            closeOnClick : true,
                        });
                    }
                });

                socket.on("user leave", function(u){
                    var user = UserService.getById(u.id);
                    user.online = false;
                    updateUserList();
                    $scope.$apply();
                });

                socket.on("room_create", function(r) {
                    if(r.creatorname==UserService.currentUser.username) {
                        $scope.rooms.push({
                            roomname: r.roomname,
                            isCreator: true,
                            isMember: false
                        });
                    }
                });
                
                socket.on("room_destroy", function(r) {
                    for(var i=0;i<$scope.rooms.length;i++) {
                        if(r.roomname==$scope.rooms[i].roomname) {
                            $scope.rooms.splice(i, 1);
                            i--;
                        }
                    }
                    $scope.$apply();
                });

                socket.on("add_member", function(m) {
                    if(m.username==UserService.currentUser.username) {
                        $scope.rooms.push({
                            roomname: m.roomname,
                            isCreator: false,
                            isMember: true
                        });
                        $scope.$apply();
                    }
                });
                
                socket.on("remove_member", function(m) {
                    if(m.username==UserService.currentUser.username) {
                        for(var i=0;i<$scope.rooms.length;i++) {
                            if(m.roomname==$scope.rooms[i].roomname) {
                                $scope.rooms.splice(i, 1);
                                i--;
                            }
                        }
                        console.log($scope.rooms);
                        $scope.$apply();
                    }
                });
            });
        }
    ]
);
