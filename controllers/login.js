/**
 * Created by baishi on 2/7/16.
 */
var app = angular.module('login', []);

app.controller('MainCtrl', function ($scope, $http, $window) {

    $scope.checkUser = function(user) {
        $http.post('/api/login', {
            loginUsername: user.loginName,
            loginPassword: user.loginPassword
        }).success(function(data, status) {
            if(data.login) {
                $window.location.href = '/';
            }
            else {
                alert('Wrong user name or password!');
            }
        });
    };

    $scope.createUser = function(user) {
        $http.post('/api/register', {
            registerUsername: user.registerName,
            registerPassword: user.registerPassword
        }).success(function(data, status) {
            if(data.register) {
                alert('Register succeeded!');
                $scope.x = {
                    mode: 'login'
                }
            }
            else {
                alert('Register failed!');
            }
        });
    };

    $scope.x = {
        mode: 'login'
    };
});