/**
 * Created by Edison on 2016/3/10.
 */
MyApp.angular.controller('SearchController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',
    function ($scope, $http, $rootScope, BootService, UserService) {

        var $$ = Dom7;
        var fw7 = MyApp.fw7.app;

        var displayNum = 10;
        var searchContext = "UserName";
        var statusForSearch = "GREEN";

        var searchContexts = [
            'UserName', 'Status', 'Announcement', 'PublicMessage', 'PrivateMessage',
        ];

        var searchStatusOptions = ['GREEN', 'YELLOW', 'RED'];

        $scope.keyword = "";

        BootService.addEventListener('ready', function(){
            $$('#search_status_li').hide();
            $$('#search_display_num').on('click', function () {
                var buttons = [];
                for(var i = 0; i < 5; i++) {
                    buttons[i] = (function(i){
                        var num = (i + 1) * 10;
                        return {
                            text : "" + num,
                            onClick: function() {
                                displayNum = num;
                                $$('#search_display_num').text(num);
                            }
                        }
                    })(i);
                }

                fw7.actions(buttons);
            });


            $$('#search_context').on('click', function(){
                var buttons = [];
                for(var i = 0; i < searchContexts.length; i++) {
                    buttons[i] = (function(i){
                        return {
                            text : searchContexts[i],
                            onClick: function() {
                                searchContext = searchContexts[i];
                                $$('#search_context').text(searchContext);
                                if(searchContext == 'Status') {
                                    $$('#search_status_li').show();
                                    $$('#search_keyword_li').hide();
                                }
                                else {
                                    $$('#search_status_li').hide();
                                    $$('#search_keyword_li').show();
                                }
                            }
                        }
                    })(i);
                }

                fw7.actions(buttons);
            });

            $$('#status_for_search').on('click', function(){
                var buttons = [];
                for(var i = 0; i < searchStatusOptions.length; i++) {
                    buttons[i] = (function(i){
                        return {
                            text : searchStatusOptions[i],
                            onClick : function() {
                                statusForSearch = searchStatusOptions[i];
                                $$('#status_for_search').text(statusForSearch);
                            }
                        }
                    })(i);
                }

                fw7.actions(buttons);
            });
        });


        BootService.addEventListener('open_search', function(){
            BootService.setNavbarTitle("Search");
        });


        $scope.onClickSearchButton = function() {
            var keyword = $scope.keyword.replace('/', ' ').trim();
            if(searchContext === 'Status') {
                keyword = statusForSearch;
            }

            if(keyword == '') {
                fw7.alert('Please enter the keyword!', "App Alert");
                return;
            }

            var url = '/search/' + keyword + '/' + searchContext + '/' + displayNum;
            $http.get(url).success(function(data){
                console.log(data);

                BootService.pushPage('search_results', {
                    searchContext: searchContext,
                    results: data,
                });

            }).error(function(data, status){
                console.log(status);
            });
        }
    }
]);