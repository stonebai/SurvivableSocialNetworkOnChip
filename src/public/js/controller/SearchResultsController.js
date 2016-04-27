/**
 * Created by Edison on 2016/3/11.
 */
MyApp.angular.controller('SearchResultsController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',
        function ($scope, $http, $rootScope, BootService, UserService) {

            var $$ = Dom7;
            var fw7 = MyApp.fw7.app;
            $scope.isMediaList = false;
            $scope.results = [];
            $scope.searchContext = "";

            BootService.addEventListener('ready', function(){

            });

            $scope.showDetailMesssage = function(message) {
                var popupHTML = '<div class="popup">' +
                    '<div class="content-block">' +
                    '<p>' + message.time + '</p>' +
                    '<p><a href="#" class="close-popup">Close</a></p>' +
                    '<p>' + message.content + '</p>' +
                    '</div>' +
                    '</div>'
                fw7.popup(popupHTML);
            }

            BootService.addEventListener('open_search_results', function (data) {
                if (!data) return;

                $scope.searchContext = data.searchContext;

                if (data.searchContext == 'UserName' || data.searchContext == 'Status') {
                    $scope.isMediaList = false;
                    data.results = filterUsers(data.results);
                }
                else if(data.searchContext == 'Announcement' ){
                    $scope.isMediaList = true;
                    data.results = filterAnnouncements(data.results);
                }
                else {
                    $scope.isMediaList = true;
                    data.results = filterMessages(data.results);
                }
                $scope.results = data.results;
            });

            function filterMessages(results) {
                var msgs = [];
                for (var i = 0; i < results.length; i++) {
                    var user = UserService.getById(results[i].author);
                    if(user && user.accountStatus === 'ACTIVE') {
                        var username = user? user.username : "";
                        results[i].sender = username
                        var date = new Date(results[i].postedAt);
                        results[i].time = BootService.formatDate(date);
                        msgs.push(results[i]);
                    }
                }
                return msgs;
            }

            function filterAnnouncements(results) {
                var msgs = [];
                for (var i = 0; i < results.length; i++) {
                    var u = UserService.getByUsername(results[i].author);
                    if(u && u.accountStatus === 'ACTIVE') {
                        results[i].sender = results[i].author;
                        var date = new Date(results[i].timestamp);
                        results[i].time = BootService.formatDate(date);
                        msgs.push(results[i]);
                    }
                }
                return msgs;
            }

            function filterUsers(results) {
                var sortedResults = [];
                var users = [];
                for (var i = 0; i < results.length; i++) {
                    var user = UserService.getById(results[i].id);
                    if(user && user.accountStatus === 'ACTIVE') {
                        results[i].online = user.online;
                        users.push(results[i]);
                    }
                }

                for(var i = 0; i < users.length; i++) {
                    if(users[i].online) {
                        sortedResults.push(users[i]);
                    }
                }
                for(var i = 0; i < users.length; i++) {
                    if(!users[i].online) {
                        sortedResults.push(users[i]);
                    }
                }
                return sortedResults;
            }

        }
    ]);