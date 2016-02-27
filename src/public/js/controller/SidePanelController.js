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

            $scope.openPrivateChat = function(user) {
                fw7.closePanel();
                BootService.trigger('private_chat', user.id);
                MyApp.fw7.mainView.router.load({
                    "pageName": 'private_chat',
                    "animatePages": false
                });
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

