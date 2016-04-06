/**
 * Created by Edison on 2016/2/25.
 */
MyApp.angular.controller('PrivateChatController',
    ['$scope', '$http', 'BootService', 'UserService', 'MessageService',
        function ($scope, $http, BootService, UserService, MessageService) {

            var dest_user = {
                'id' : null
            };

            var $$ = Dom7;
            var socket = null;
            var messageLayout = MyApp.fw7.app.messages('#private_messages', {
                autoLayout: true
            });
            
                    // send image start
        var $$ = Dom7;
        $$('#cameraInput2').on('change', function(){
            $scope.uploadImage();
        });
        
        $scope.uploadImage = function () {
            var data, xhr;
            data = new FormData();
            data.append( 'file', $$('#cameraInput2')[0].files[0]);
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
            document.querySelector('#cameraInput2').click();
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

            function addMessageToLayout(msg) {
                var messageType = (msg.author == UserService.currentUser.id) ? 'sent': 'received';
                var authorName = UserService.getById(msg.author).username;
                var date = new Date(msg.timestamp || msg.postedAt);
                messageLayout.addMessage({
                    text: msg.content,
                    type: messageType,
                    name: authorName,
                    day: BootService.formatDay(date),
                    time: BootService.formatTime(date),
                });
            }

            function addMessages(data) {
                var msgs = [];
                for(var i = 0; i < data.length; i++) {
                    var msg = data[i];
                    var date = new Date(msg.timestamp || msg.postedAt);
                    var messageType = (msg.author == UserService.currentUser.id) ? 'sent': 'received';
                    var authorName = UserService.getById(msg.author).username;
                    msgs.push({
                        text: msg.content,
                        type: messageType,
                        name: authorName,
                        day: BootService.formatDay(date),
                        time: BootService.formatTime(date),
                    });
                }
                messageLayout.addMessages(msgs, 'append', false);
                messageLayout.scrollMessages();
            }

            BootService.addEventListener('open_private_chat', function(uid){
                dest_user = UserService.getById(uid);
                if(!dest_user)
                    return;

                BootService.setNavbarTitle(dest_user.username);
                messageLayout.clean();
                MessageService.getMessages(dest_user.id).then(function(msgs){
                    addMessages(msgs);
                });
            });

            BootService.addEventListener('login', function(){
                socket = MyApp.socket;

                socket.on('private message', function(msg){

                    MessageService.add(msg);

                    if(msg.author == dest_user.id
                        || msg.target == dest_user.id) {
                        addMessageToLayout(msg);
                    }
                    else if(msg.author != UserService.currentUser.id) {
                        // notify the user.
                        var notifyContent = msg.content;
                        if(notifyContent.length > 140) {
                            notifyContent = notifyContent.substr(0, 140);
                            notifyContent += "...";
                        }
                        var authorName = UserService.getById(msg.author).username;
                        MyApp.fw7.app.addNotification({
                            title: 'Received Private Message',
                            subtitle: 'From ' + authorName,
                            message: notifyContent,
                            hold : 10000,
                            media: '<i class="icon icon-f7"></i>',
                            closeOnClick : true,
                            onClick : function() {
                                openPrivateChat(msg.author);
                            }
                        });
                    }
                });
            });

            $scope.keyUp = function(event, message) {
                if(event.keyCode == 13 && message.trim() != '') {
                    $scope.sendMessage(message);
                }
            }

            function openPrivateChat(uid) {
                BootService.openPage('private_chat', uid);
            }

            BootService.addEventListener('close_private_chat', function(){
                dest_user = {};
            });

            $scope.sendMessage = function(content) {
                var post = {
                    receiver_id : dest_user.id,
                    content : content,
                    timestamp: new Date(),
                }
                socket.emit('private message', post);
                $scope.post = "";
            }

        }

    ]
);
