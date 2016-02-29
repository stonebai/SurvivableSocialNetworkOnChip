/**
 * Created by Yu Zheng on 2016/2/27.
 */
MyApp.angular.controller('StatusPopoverController',
    ['$scope', '$http', '$window', '$location', 'BootService',
    function ($scope, $http, $window, $location, BootService) {

        var fw7 = MyApp.fw7.app;
        var $$ = Dom7;
        $scope.select = function(status) {
        	$$('.navbar').find('a.link.open-popover').text(status);
        	fw7.closeModal();
        	fw7.alert("Your status: " + status, "Status Changed");
        }
        
        // BootService.addEventListener('login', function() {
        //     $scope.username = MyApp.username;
        //     $http.post("/api/users").success(function(users) {
        //         $scope.users = users;
        //         UserService.addUsers(users);
        //     });
        // });
    }
]);