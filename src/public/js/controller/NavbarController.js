/**
 * Created by Edison on 2016/2/25.
 */
MyApp.angular.controller('NavbarController',
    ['$scope', '$http', '$rootScope', '$location', 'BootService',
    function ($scope, $http, $rootScope, $location, BootService) {

        var fw7 = MyApp.fw7.app;
        var $$ = Dom7;

        $rootScope.isPagePushed = false;

        $scope.clickNav = function() {
            if ($$('body').hasClass('with-panel-left-reveal')) {
                fw7.closePanel();
            }
            else {
                fw7.openPanel('left');
            }
        }

        $scope.clickBack = function() {
            BootService.popPage();
        }

        $scope.showProfileLink = function() {
            var page = BootService.getCurrentPage();
            return page === 'private_chat';
        }

        $scope.openProfilePage = function() {
            var username = BootService.getNavbarTitle();
            console.log("openProfilePage : " + username);
            BootService.openPage('profile', username);
        }
    }
]);

