/**
 * Created by baishi on 4/1/16.
 */
MyApp.angular.controller('CreateRoomController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',
        function ($scope, $http, $rootScope, BootService, UserService) {

            var $$ = Dom7;
            var fw7 = MyApp.fw7.app;

            BootService.addEventListener('open_createRoom', function() {
                BootService.setNavbarTitle("New Room");
            });

            $scope.createRoom = function(roomname) {
                $http.post('/room', {
                    roomname: roomname,
                    creatorname: UserService.currentUser.username
                }).success(function(data, status) {
                    if(status==201) {
                        data.isCreator = true;
                        BootService.openPage('room_chat', data);
                    }
                }).error(function(data, status) {
                    if(status==409) {
                        fw7.alert('This room name has already been taken', 'Duplicate Name');
                    }
                });
            }
        }
    ]
);