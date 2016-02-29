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

            BootService.addEventListener('login', function(){
                $scope.username = UserService.currentUser.username;

                var users = UserService.getAll();
                $scope.users = [];
                for(var i in users) {
                    if(users[i].id != UserService.currentUser.id) {
                        $scope.users.push(users[i]);
                    }
                }
                UserService.addUsers(users);
                
                
                var socket = MyApp.socket;
                socket.on('status change', function(u){
                    var user = UserService.getById(u.id);
                    user.lastStatusCode = u.lastStatusCode;
                    $scope.$apply();
                });

            });

        }
    ]);

