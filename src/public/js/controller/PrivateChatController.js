/**
 * Created by Edison on 2016/2/25.
 */
MyApp.angular.controller('PrivateChatController',
    ['$scope', '$http', 'BootService',
        function ($scope, $http, BootService) {

            var dest_user = null;
            var $$ = Dom7;

            BootService.addEventListener('private_chat', function(data){
                dest_user = data;
                $$('.navbar').find('.center').text("Chat With " + dest_user.username);
            });
        }

    ]
);