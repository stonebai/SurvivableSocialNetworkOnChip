MyApp.angular.controller('ChatController', 
    ['$scope', '$http', '$window', '$location', '$anchorScroll', 'BootService', 
    function ($scope, $http, $window, $location, $anchorScroll, BootService) {
        
        $scope.messages = [];
        $scope.session = null;
        var socket = null;
        var messageLayout = MyApp.fw7.app.messages('.messages', {
            autoLayout: true
        });
        
        function addMessageToLayout(post) {
            var messageType = (post.author == MyApp.username) ? 'sent': 'received';
            messageLayout.addMessage({
                // Message text
                text: post.content,
                // Random message type
                type: messageType,
                // Avatar and name:
                //avatar: avatar,
                name: post.author,
                // Day
                //day: !conversationStarted ? 'Today' : false,
                //time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
            });
        }
        
        $scope.sendMessage = function (message) {
            var post = {
                author: MyApp.username,
                content: message,
                timestamp: new Date()
            }
            socket.emit('public chat', post);
            $scope.post = "";
        };

        BootService.addEventListener('login', function () {
            
            socket = MyApp.socket;
            
            /*
            $http.get('/api/session').success(function (data, status) {
                $scope.session = data;
                console.log(data);
            }).success(function (data) {
                $http.get('/api/messages').success(function (data, status) {
                    for (var i = 0; i < data.length; i++) {
                        addMessageToLayout(data[i]);
                    }
                });
            });
             */
            $http.get('/api/messages').success(function (data, status) {
                for (var i = 0; i < data.length; i++) {
                    addMessageToLayout(data[i]);
                }
            });

            socket.on('public chat', function (post) {
                //$scope.messages.push(post);
                //$scope.$apply();
                addMessageToLayout(post);
            });
            
        });
        
}]);

