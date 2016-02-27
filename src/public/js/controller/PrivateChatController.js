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

            function addMessageToLayout(msg) {
                var messageType = (msg.sender.id == UserService.currentUser.id) ? 'sent': 'received';
                messageLayout.addMessage({
                    text: msg.content,
                    type: messageType,
                    name: msg.sender.username,
                });
            }

            function addMessages(data) {
                var msgs = [];
                for(var i = 0; i < data.length; i++) {
                    var msg = data[i];
                    var messageType = (msg.sender.id == UserService.currentUser.id) ? 'sent': 'received';
                    msgs.push({
                        text: msg.content,
                        type: messageType,
                        name: msg.sender.username,
                    });
                }
                messageLayout.addMessages(msgs, 'append', false);
                messageLayout.scrollMessages();
            }

            BootService.addEventListener('private_chat', function(uid){
                dest_user = UserService.getById(uid);
                if(!dest_user)
                    return;

                $$('.navbar').find('.center').text("Chat With " + dest_user.username);
                messageLayout.clean();
                MessageService.getMessages(dest_user.id).then(function(msgs){
                    addMessages(msgs);
                });
            });

            BootService.addEventListener('login', function(){
                socket = MyApp.socket;

                socket.on('private message', function(msg){
                    if(msg.sender.id == dest_user.id
                        || msg.receiver.id == dest_user.id) {
                        addMessageToLayout(msg);
                    }

                    MessageService.add(msg);
                });
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

    ]);