/**
 * created by yuanyuan 4/5/2016
 */

 MyApp.angular.controller('AgencyContactController',
     ['$scope', '$http', 'BootService', 'UserService',
         function($scope, $http, BootService, UserService) {

             var socket = null;
             var $$ = Dom7;

             $scope.requests = [];
             $scope.contents = [];

             BootService.addEventListener('open_agencyContact', function(){
                BootService.setNavbarTitle('Agency Contact');
                getAllAgencyContact();
                getAllRequests();

             });

             function getAllRequests() {
                 var username = UserService.currentUser.username;
                 $http.get('/agencyContact/request/' + username).success(function(data){
                     console.log(data);
                     $scope.requests = data;
                 }).error(function(data, status){
                     console.log(status);
                 });
             }

             function getAllAgencyContact() {
                 var username = UserService.currentUser.username;
                 $http.get('/agencyContact/content/' + username).success(function(data){
                     console.log(data);
                     $scope.contents = data;
                 }).error(function(data, status){
                     console.log(status);
                 });
             }

             $scope.request = function() {
                 var post = {
                     author: UserService.currentUser.username,
                     //status: true,
                     content: "Hello World",
                     timestamp: new Date(),
                     location: null
                 };

                 var user1 = UserService.currentUser.username;
                 var user2 = $scope.username;
                 $http.post('/agencyContact/request/' + user1 + '/' + user2, post).success(function(data){
                     console.log(data);
                 }).error(function(data, status){
                     console.log(status);
                 });
                 $scope.agencyContactRequest = '';
             };

             var fw7 = MyApp.fw7.app;

             $scope.confirm = function(req) {
                 var user2 = UserService.currentUser.username;
                var user1 = req.author;
                 console.log(user1);


                 fw7.confirm('Are you sure as agency contact?', function () {
                    //fw7.alert('You clicked Ok button');

                    $http.post('/agencyContact/reply/' + user2 + '/' + user1, {
                        state: true,
                    }).success(function(data){
                        console.log(data);
                        getAllRequests();
                    }).error(function(data, status) {
                        console.log(status);
                    });

                });

             }

            //  function loadAgencyContactRequest(data) {
            //      $scope.agencyContactRequest= [];
            //      for (var i = 0; i<data.length; i++) {
            //          data[i].dateFormat = dateFormat(data[i].timestamp);
            //          $scope.agencyContactRequest.unshift(data[i]);
            //      }
            //  }
             //
            //  BootService.addEventListener('agencyContact', function() {
             //
            //      socket = MyApp.socket;
            //      $$('.navbar').find('.center').text("Announcement Board");
             //
            //      $http.get('/api/agencyContact').success(function(data, status) {
            //          loadAgencyContactRequest(data);
            //      });
             //
            //      socket.on('post agency contact request', function (post) {
            //          post.dateFormat = dateFormat(post.timestamp);
            //          $scope.agencyContactRequest.unshift(post);
            //          $scope.$apply();
            //      });
            //  });

             function dateFormat(unformatedDate) {
                 var date = new Date(unformatedDate);
                 return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDay()+'\t'
                     +date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
             }
         }
     ]
 );
