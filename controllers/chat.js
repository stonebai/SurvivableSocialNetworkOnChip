/**
 * Created by baishi on 2/11/16.
 */
var app = angular.module('chat', []);

app.controller('MainCtrl', function($scope, $http) {

    var socket = io();

    $scope.session = null;
    $scope.messages = new Array();

    $http.get('/api/session').success(function(data, status) {
        $scope.session = data;
    });

    $http.get('/api/messages').success(function(data, status) {
        for(var i=0;i<data.length;i++) {
            $scope.messages.push(data[i]);
        }
    });

    $scope.sendMessage = function(message) {
        var post = {
            author: $scope.session.username,
            content: message,
            timestamp: new Date()
        }
        socket.emit('public chat', post);
    };

    socket.on('public chat', function(post) {
        $scope.messages.push(post);
        $scope.$apply();
    });

});