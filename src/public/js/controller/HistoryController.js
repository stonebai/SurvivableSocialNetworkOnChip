/**
 * Created by Edison on 2016/4/24.
 */
MyApp.angular.controller('HistoryController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',
        function ($scope, $http, $rootScope, BootService, UserService) {
            var $$ = Dom7;
            var fw7 = MyApp.fw7.app;

            var historyTypes = {
                1: 'Log',
                2: 'Status Changed',
                3: 'Post Message',
                4: 'Post Announcement',
            };

            $scope.results = [];
            $scope.username = "";

            $scope.showDetailMesssage = function(message) {
                var popupHTML = '<div class="popup">' +
                    '<div class="content-block">' +
                    '<p>' + message.time + '</p>' +
                    '<p><a href="#" class="close-popup">Close</a></p>' +
                    '<p>' + message.html + '</p>' +
                    '</div>' +
                    '</div>'
                fw7.popup(popupHTML);
            }

            BootService.addEventListener('open_history', function (username) {
                $scope.results = [];
                $scope.username = username;
                var request = '/userhistory/';
                request = request.concat(username);
                $http.get(request).success(function (data, status) {
                    if(status == 200) {
                        for(var i = 0; i < data.length; i++) {
                            console.log(data[i]);
                            var date = new Date(data[i].timestamp);

                            var msg = {};
                            if(data[i].type == 1) {
                                if(data[i].content.indexOf('signed') >= 0) {
                                    msg.type = 'Signed in';
                                } else {
                                    msg.type = 'Logged out';
                                }
                            }
                            else {
                                msg.type = historyTypes[data[i].type];
                            }

                            if(data[i].content) {
                                msg.html = data[i].content;
                                msg.content = data[i].content;
                                if(msg.content.indexOf("<img src='/public/avatar/") >= 0) {
                                    msg.content = "Post an image in public chat";
                                }

                                msg.time = BootService.formatDate(date);
                                $scope.results.push(msg);
                            }
                        }
                    }
                });
            });
        }
    ]
);

