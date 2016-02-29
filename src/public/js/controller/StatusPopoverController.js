/**
 * Created by Yu Zheng on 2016/2/27.
 */
MyApp.angular.controller('StatusPopoverController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',
    function ($scope, $http, $rootScope, BootService, UserService) {

        var fw7 = MyApp.fw7.app;
        var $$ = Dom7;
        $scope.select = function(status) {
        	$$('.navbar').find('a.link.open-popover').text(status);
        	fw7.closeModal();
        	$http.put('/users/current', {
                "lastStatusCode" : status
            }).success(function(data, s){
                console.log(data);
                fw7.alert("Your status: " + status, "Status Changed");
            }).error(function(data, s){
                console.log(data);
            });

        }
        
        BootService.addEventListener('login', function(){
            var user = UserService.currentUser;
            $rootScope.currentStatus = user.lastStatusCode;
        });
        
        
    }
]);