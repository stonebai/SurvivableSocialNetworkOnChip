MyApp.angular.controller('PublicChatController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',
    function ($scope, $http, $rootScope, BootService, UserService) {
        
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
                    name: post.author
                });
            }
            messageLayout.addMessages(msgs, 'append', false);
            messageLayout.scrollMessages();
        }

        $scope.sendMessage = function (message) {
            var post = {
                author: UserService.currentUser.username,
                content: message,
                timestamp: new Date(),
            }
            socket.emit('public chat', post);
            $scope.post = "";
        };

        $scope.keyUp = function(event, message) {
            if(event.keyCode == 13 && message.trim() != '') {
                $scope.sendMessage(message);
            }
        }

        BootService.addEventListener('login', function () {
            
            socket = MyApp.socket;
            $scope.username = UserService.currentUser.username;

            $http.get('/messages/public').success(function (data, status) {
                if(status == 200) {
                    for(var i = 0; i < data.length; i++) {
                        data[i].author = UserService.getById(data[i].author).username;
                    }
                    addMessages(data);
                }
            });

            socket.on('public chat', function (post) {
                //$scope.messages.push(post);
                //$scope.$apply();
                addMessageToLayout(post);
            });
            
        });

        BootService.addEventListener('open_public_chat', function(){
            BootService.setNavbarTitle("Public Chat");
        });

}]);

