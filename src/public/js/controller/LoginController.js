MyApp.angular.controller('LoginController', 
    ['$scope', '$http', '$window', 'BootService',
    function ($scope, $http, $window, BootService) {

        var fw7 = MyApp.fw7.app;
        
        console.log("LoginController")

        $scope.login = function (user) {
            if (user.name.length < 3) {
                fw7.alert('user name should be at least 3 character long!', "App Alert");
                return;
            }
            if (user.password.length < 4) {
                fw7.alert('password should be at least 4 character long', "App Alert");
                return;
            }

            $http.post('/api/login', {
                loginUsername: user.name,
                loginPassword: user.password
            }).success(function (data, status) {
                if (data.login == 'success') {
                    //$window.location.href = '/';
                    loginSuccess(user);
                }
                else if (data.login == 'fail') {
                    fw7.alert('Wrong user name or password!', "App Alert");
                }
                else {
                    fw7.confirm('You want to create a new user: ' + user.name + '?', 'Register New User', function(){
                        $http.post('/api/register', {
                            registerUsername: user.name,
                            registerPassword: user.password
                        }).success(function (data, status) {
                            if (data.register) {
                                //$window.location.href = '/';
                                loginSuccess(user);
                            }
                            else {
                                fw7.alert('Register failed, please try again later!',"App Alert");
                            }
                        });
                    })
                }
            });
        }
        
        function loginSuccess(user) {
            MyApp.socket = io();
            MyApp.username = user.name;
            MyApp.fw7.app.closeModal();
            BootService.trigger('login');
        }
    
    }]
);