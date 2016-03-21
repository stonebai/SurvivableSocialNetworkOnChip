/**
 * Created by Edison on 2016/2/25.
 */

MyApp.angular.controller('SidePanelController',
    ['$scope', '$http', 'BootService', 'UserService',
        function ($scope, $http, BootService, UserService) {

            var fw7 = MyApp.fw7.app;
            var $$ = Dom7;

            $scope.users = [];
            $scope.username = "";

            $scope.openPage = function(pageName) {
                BootService.openPage(pageName);
            }

            $scope.openPrivateChat = function(user) {
                fw7.closePanel();
                BootService.openPage('private_chat', user.id);
            }

            $scope.openAnnouncement = function() {
                fw7.closePanel();
                BootService.trigger('announcements');
                BootService.openPage('Announcements');
            }

            $scope.logout = function() {
                MyApp.fw7.app.confirm("Do you want to logout?", "App Alert", function(){
                    $http.delete("/users/logout", {}).success(function(data, status){
                        if(status == 204) {
                            fw7.closePanel();
                            BootService.trigger('logout');
                        }
                    });
                });
            }

            function updateUserList() {
                var users = UserService.getAll();
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

            BootService.addEventListener('login', function(){
                $scope.username = UserService.currentUser.username;
                updateUserList();

                var socket = MyApp.socket;
                socket.on('status change', function(u){
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

            });

        }
    ]);

