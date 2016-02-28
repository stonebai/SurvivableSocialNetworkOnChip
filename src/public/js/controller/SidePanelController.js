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
                    $http.post("/api/logout", {}).success(function(data){
                        fw7.closePanel();
                        BootService.trigger('logout');
                    });
                });
            }

            BootService.addEventListener('login', function(){
                $scope.username = MyApp.username;
                $http.get("/api/users").success(function(users){
                    $scope.users = users;
                    UserService.addUsers(users);
                });
            });


        }
    ]);

