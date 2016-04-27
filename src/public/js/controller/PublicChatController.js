MyApp.angular.controller('PublicChatController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',
    function ($scope, $http, $rootScope, BootService, UserService) {
        
        $scope.messages = [];
        $scope.username = "";
        var socket = null;
        var messageLayout = MyApp.fw7.app.messages('#public_messages', {
            autoLayout: true
        });

        // send image start
        var $$ = Dom7;
        $$('#cameraInput1').on('change', function(){
            $scope.uploadImage();
        });
        
        $scope.uploadImage = function () {
            var data, xhr;
            data = new FormData();
            data.append( 'file', $$('#cameraInput1')[0].files[0]);
            xhr = new XMLHttpRequest();
            xhr.open('POST', '/image', true );
            xhr.onreadystatechange = function ( response ) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                     var resObj = JSON.parse(xhr.responseText);
                     console.log(resObj.url);
                     $scope.sendMessage("<img src='/" + resObj.url + "' width=200>");
                }
            };
            xhr.send( data );
        }
        
        $scope.sendImage = function (imagesrc) {
            document.querySelector('#cameraInput1').click();
        }
        
        function addImageToLayout(post) {
            var messageType = (post.author == UserService.currentUser.username) ? 'sent': 'received';
            var date = new Date(post.timestamp || post.postedAt);
            messageLayout.addMessage({
                // Message text
                text: post.content,
                // Random message type
                type: messageType,

                name: post.author,
                // Day
                day: BootService.formatDay(date),
                time: BootService.formatTime(date),

            });
        }
        // send image end
                
        function addMessageToLayout(post) {
            var messageType = (post.author == UserService.currentUser.username) ? 'sent': 'received';
            var date = new Date(post.timestamp || post.postedAt);
            messageLayout.addMessage({
                // Message text
                text: post.content,
                // Random message type
                type: messageType,
                // Avatar and name:
                //avatar: avatar,
                name: post.author,
                // Day
                day: BootService.formatDay(date),
                time: BootService.formatTime(date),

            });
        }

        function addMessages(data) {
            var msgs = [];
            for(var i = 0; i < data.length; i++) {
                var post = data[i];
                var date = new Date(post.timestamp || post.postedAt);
                var messageType = (post.author == UserService.currentUser.username) ? 'sent': 'received';
                msgs.push({
                    text: post.content,
                    type: messageType,
                    name: post.author,
                    day: BootService.formatDay(date),
                    time: BootService.formatTime(date),
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
            };
            socket.emit('public chat', post);
            $scope.post = "";
        };

        $scope.keyUp = function(event, message) {
            if(event.keyCode == 13 && message.trim() != '') {
                $scope.sendMessage(message);
            }
        };

        BootService.addEventListener('open_public_chat', function(){
            messageLayout.clean();
            $http.get('/messages/public').success(function (data, status) {
                console.log('open_public_chat');
                if(status == 200) {
                    var msgs = [];
                    for(var i = 0; i < data.length; i++) {
                        var u = UserService.getById(data[i].author);
                        if (u && u.accountStatus === 'ACTIVE') {
                            var msg = data[i];
                            msg.author = u.username;
                            msgs.push(msg);
                        }
                    }
                    addMessages(msgs);
                }
            });
        });

        BootService.addEventListener('login', function () {
            
            socket = MyApp.socket;
            $scope.username = UserService.currentUser.username;

            BootService.trigger('open_public_chat');
            //$http.get('/messages/public').success(function (data, status) {
            //    if(status == 200) {
            //        for(var i = 0; i < data.length; i++) {
            //            data[i].author = UserService.getById(data[i].author).username;
            //        }
            //        addMessages(data);
            //    }
            //});

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

