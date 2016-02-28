/**
 * Created by baishi on 2/26/16.
 */

MyApp.angular.controller('AnnouncementController',
    ['$scope', '$http', 'BootService',
        function($scope, $http, BootService) {

            var socket = null;
            $scope.announcements = [];
            var $$ = Dom7;

            $scope.postAnnouncement = function(newAnnouncement) {
                var post = {
                    author: MyApp.username,
                    content: newAnnouncement,
                    timestamp: new Date(),
                    location: null
                };
                socket.emit('post annoucement', post);
                $scope.newAnnouncement = '';
            };

            function loadAnnouncements(data) {
                for (var i = 0; i<data.length; i++) {
                    $scope.announcements.unshift(data[i]);
                }
            }

            BootService.addEventListener('announcements', function() {

                socket = MyApp.socket;
                $$('.navbar').find('.center').text("Announcement Board");

                $http.get('/api/announcements').success(function(data, status) {
                    loadAnnouncements(data);
                });

                socket.on('post annoucement', function (post) {
                    $scope.announcements.unshift(post);
                    $scope.$apply();
                });
            });
        }
    ]
);