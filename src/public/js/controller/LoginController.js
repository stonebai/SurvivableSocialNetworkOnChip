MyApp.angular.controller('LoginController', 
    ['$scope', '$http', '$window', 'BootService', 'UserService', 'RoomService',
    function ($scope, $http, $window, BootService, UserService, RoomService) {

        var fw7 = MyApp.fw7.app;
        
        console.log("LoginController");

        $scope.login = function (user) {
            if (user.name.length < 3) {
                fw7.alert('user name should be at least 3 character long!', "App Alert");
                return;
            }
            if (user.password.length < 4) {
                fw7.alert('password should be at least 4 character long', "App Alert");
                return;
            }

            var loginRequest = {
                createdAt: new Date().getTime(),
                password: user.password,
                force: false
            };

            $http.post('/users/' + user.name, loginRequest).success(function (data, status) {
                // if new user is created, status code = 201
                if (status == 205) {
                    fw7.confirm('Are you going to create a new user: ' + user.name, 'Create New User?',
                    function() {
                        loginRequest.force = true;
                        $http.post('/users/' + user.name, loginRequest).success(function (data, status) {
                            if (status == 201) loginSuccess(data);
                        });
                    });
                }
                else if (status == 200) {
                    //if user exists, status code = 200
                    loginSuccess(data);
                }
            }).error(function(data, status){
                if(status === 406) {
                    fw7.alert("Your account is INACTIVE. You cannot login now!", "INACTIVE");
                }
                else {
                    fw7.alert('Wrong user name or password!', "" + status);
                }
            });
        };
        
        function loginSuccess(user) {
            BootService.connect();
            //MyApp.socket = io();
            UserService.currentUser = user;
            MyApp.fw7.app.closeModal();
            BootService.openPage('about');
            $http.get("/users").success(function(users, status){
                if(status == 200) {
                    UserService.addUsers(users);
                    $http.get("/room/rooms/"+user.username).success(function(crooms, crStatus) {
                        if(crStatus == 200) {
                            RoomService.addCreatorRooms(crooms);
                        }
                        $http.get("/member/rooms/"+user.username).success(function(mrooms, mrStatus) {
                            if(mrStatus == 200) {
                                RoomService.addMemberRooms(mrooms);
                            }
                            BootService.trigger('login');
                        });
                    });
                }
            }).error(function(data){
                console.log("ERROR!!!!!!!!!!!!!!!!");
            });
        }
    }]
);