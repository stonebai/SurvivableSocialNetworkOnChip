/**
 * Created by baishi on 2/26/16.
 */

MyApp.angular.controller('AnnouncementController',
    ['$scope', '$http', 'BootService', 'UserService',
        function($scope, $http, BootService, UserService) {

            var socket = null;
            var $$ = Dom7;

            $scope.postAnnouncement = function(newAnnouncement) {
                var post = {
                    author: UserService.currentUser.username,
                    content: newAnnouncement,
                    timestamp: new Date(),
                    location: null
                };
                $http.post('/announcements', post);
                $scope.newAnnouncement = '';
            };

            function loadAnnouncements(data) {
                $scope.announcements = [];
                for (var i = 0; i<data.length; i++) {
                    data[i].dateFormat = dateFormat(data[i].timestamp);
                    $scope.announcements.unshift(data[i]);
                }
            }

            BootService.addEventListener('open_announcements', function() {

                socket = MyApp.socket;
                $$('.navbar').find('.center').text("Announcement Board");

                $http.get('/api/announcements').success(function(data, status) {
                    loadAnnouncements(data);
                });

                socket.on('post annoucement', function (post) {
                    post.dateFormat = dateFormat(post.timestamp);
                    $scope.announcements.unshift(post);
                    $scope.$apply();
                });
            });

            function dateFormat(unformatedDate) {
                var date = new Date(unformatedDate);
                return BootService.formatDay(date) +'\t' + BootService.formatTime(date);
            }
        }
    ]
);