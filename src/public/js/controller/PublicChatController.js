MyApp.angular.controller('PublicChatController',
    ['$scope', '$http', '$window', '$location', '$anchorScroll', 'BootService', 'UserService',
    function ($scope, $http, $window, $location, $anchorScroll, BootService, UserService) {
        
        $scope.messages = [];
        $scope.username = "";
        var socket = null;
        var messageLayout = MyApp.fw7.app.messages('#public_messages', {
            autoLayout: true
        });
        
        function addMessageToLayout(post) {
            var messageType = (post.author == UserService.currentUser.username) ? 'sent': 'received';
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

        function addMessages(data) {
            var msgs = [];
            for(var i = 0; i < data.length; i++) {
                var post = data[i];
                var messageType = (post.author == UserService.currentUser.username) ? 'sent': 'received';
                msgs.push({
                    text: post.content,
                    type: messageType,
                    name: post.author,
                });
            }
            messageLayout.addMessages(msgs, 'append', false);
            messageLayout.scrollMessages();
        }

        $scope.sendMessage = function (message) {
            var post = {
                author: UserService.currentUser.username,
                content: message,
                timestamp: new Date()
            }
            socket.emit('public chat', post);
            $scope.post = "";
        };

        BootService.addEventListener('login', function () {
            
            socket = MyApp.socket;
            $scope.username = UserService.currentUser.username;
            
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
                addMessages(data);

            });

            socket.on('public chat', function (post) {
                //$scope.messages.push(post);
                //$scope.$apply();
                addMessageToLayout(post);
            });
            
        });
        
}]);

