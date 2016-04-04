/**
 * Created by baishi on 4/1/16.
 */
MyApp.angular.controller('RoomController',
    ['$scope', '$http', 'BootService', 'UserService', 'RoomService',
        function ($scope, $http, BootService, UserService, RoomService) {
            
            $scope.currentRoom = {
                roomname : null,
                isCreator: false,
                isMember: false
            };

            $scope.members = [];
            $scope.allUsers = [];

            var $$ = Dom7;
            var fw7 = MyApp.fw7.app;
            var socket = null;
            var messageLayout = MyApp.fw7.app.messages('#room_messages', {
                autoLayout: true
            });

            function addMessageToLayout(msg) {
                var messageType = (msg.author == UserService.currentUser.username) ? 'sent' : 'received';
                var date = new Date(msg.postedAt);
                messageLayout.addMessage({
                    text: msg.content,
                    type: messageType,
                    name: msg.author,
                    day: BootService.formatDay(date),
                    time: BootService.formatTime(date)
                });
                messageLayout.scrollMessages();
            }
            
            function addMessages(msgs) {
                for(var i=0;i<msgs.length;i++) {
                    addMessageToLayout(msgs[i]);
                }
            }

            BootService.addEventListener('open_room_chat', function(room) {
                socket = MyApp.socket;
                $scope.currentRoom = room;
                BootService.setNavbarTitle($scope.currentRoom.roomname);
                messageLayout.clean();
                RoomService.getMessages($scope.currentRoom.roomname, function(msgs) {
                    addMessages(msgs);
                });

                socket.on($scope.currentRoom.roomname + '_message', function(msg) {
                    addMessageToLayout(msg);
                });

                socket.on('add_member', function(member) {
                    if($scope.currentRoom.roomname==member.roomname) {
                        $scope.members.push(member);
                    }
                    $scope.$apply();
                });

                socket.on('remove_member', function(member) {
                    console.log(member);
                    if(member.username==UserService.currentUser.username) {
                        BootService.openPage('public_chat');
                    }
                    if($scope.currentRoom.roomname==member.roomname) {
                        for(var i=0;i<$scope.members.length;i++) {
                            if($scope.members[i].username==member.username) {
                                $scope.members.splice(i, 1);
                            }
                        }
                        $scope.$apply();
                    }
                });

                socket.on('room_destroy', function(room) {
                    fw7.alert('This group has been dismissed!');
                    BootService.openPage('public_chat');
                });
            });

            BootService.addEventListener('close_room_chat', function() {
                $scope.members = [];
                $scope.$apply();
            });

            $scope.close = function() {
                fw7.confirm('Are you going to close this group: ' + $scope.currentRoom.roomname, 'Close?',
                    function() {
                        $http.put('/room', {
                            roomname: $scope.currentRoom.roomname,
                            creatorname: UserService.currentUser.username
                        });
                        BootService.openPage('public_chat');
                    }
                );
            };

            $scope.leave = function() {
                fw7.confirm('Are you going to leave this group: ' + $scope.currentRoom.roomname, 'Leave?',
                    function() {
                        $http.put('/member/' + $scope.currentRoom.roomname, {
                            username: UserService.currentUser.username,
                            self: true
                        }).success(function() {
                            BootService.openPage('public_chat');
                        });
                    }
                );
            };

            $scope.updateUserList = function() {
                $scope.allUsers = [];
                $http.get('/users').success(function(users) {
                    for(var i=0;i<users.length;i++) {
                        $scope.allUsers.push(users[i]);
                    }
                });
            };

            $scope.addUser = function(user) {
                $http.post('/member/'+$scope.currentRoom.roomname, {
                    creatorname: UserService.currentUser.username,
                    username: user.username
                }).success(function(data, status) {
                    if(status==205) {
                        fw7.alert("This user is already a member!");
                    }
                });
            };

            $scope.rKeyUp = function(event, message) {
                if(event.keyCode == 13 && message.trim() != '') {
                    $scope.rmsgPost(message);
                }
            }

            $scope.rmsgPost = function(rmsg) {
                var post = {
                    content: rmsg,
                    postedAt: new Date()
                };
                $http.post( '/roommessage/' + UserService.currentUser.username +
                            '/' + $scope.currentRoom.roomname, post).success(function() {
                    $scope.rmsg = '';
                });
            }
        }
    ]
);