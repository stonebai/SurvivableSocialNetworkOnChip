/**
 * Created by Edison on 2016/2/25.
 */
MyApp.angular.controller('NavbarController',
    ['$scope', '$http', '$window', '$location', 'BootService',
    function ($scope, $http, $window, $location, BootService) {

        var fw7 = MyApp.fw7.app;
        var $$ = Dom7;

        $scope.clickNav = function() {
            if ($$('body').hasClass('with-panel-left-reveal')) {
                fw7.closePanel();
            }
            else {
                fw7.openPanel('left');
            }
        }
    }
]);

