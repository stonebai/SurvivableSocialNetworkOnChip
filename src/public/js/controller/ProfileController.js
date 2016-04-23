/**
 * Created by Edison on 2016/4/4.
 */
MyApp.angular.controller('ProfileController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',
        function ($scope, $http, $rootScope, BootService, UserService) {

            $scope.profileItems = [];
            $scope.profile = {};
            $scope.editable = false;

            $scope.profile.avatar = 'public/img/small-default-avatar.png';

            var fields = [ 'accountStatus', 'privilege', 'age', 'gender', 'company', 'twitter',
                        'phone', 'email', ];

            for(var i = 0; i < fields.length; i++) {
                var field = fields[i];
                $scope.profileItems[i] = {field: field, value:''};
            }

            function setProfileItem(field, value) {
                for(var i = 0; i < $scope.profileItems.length; i++) {
                    if($scope.profileItems[i].field === field) {
                        $scope.profileItems[i].value = value;
                        break;
                    }
                }
            }

            function setProfileItems(data) {
                for(var field in data) {
                    var value = data[field];
                    setProfileItem(field, value);
                }
            }

            BootService.addEventListener('open_profile', function(username){
                BootService.setNavbarTitle("Profile");
                $scope.profile.avatar = 'public/img/small-default-avatar.png';
                if(username === undefined) {
                    username = UserService.currentUser.username;
                }

                if(username === UserService.currentUser.username) {
                    $scope.editable = true;
                }
                else {
                    $scope.editable = false;
                }

                var url = '/profile/' + username;
                $http.get(url).success(function(data){
                    setProfileItems(data);
                    $scope.profile = data;
                    console.log(data);
                }).error(function(data, status){
                    console.log(data);
                });
		});


            $scope.openEditPage = function() {
                BootService.openPage('edit_profile');
            }

            $scope.isAdmin = function() {
                //return true;
                var user = UserService.currentUser;
                return user && user.privilege === 'Administrator';
            }

            $scope.openAdminPage = function() {
                var profile = $scope.profile;
                BootService.openPage('admin_edit', profile);

            }
	    var historyLayout = MyApp.fw7.app.messages('#history_messages', {
		    autoLayout: true
		});


	    $scope.openUserHistory = function(user) {
		console.log("yo");
		console.log("opening User History "+user);
		BootService.openPage("userHistory");
		//TODO remove all of the old history elements
		
		socket = MyApp.socket;
		$scope.username = UserService.currentUser.username;
		
		
		var request = '/userhistory/';
		request = request.concat(user);
		$http.get(request).success(function (data, status) {
			historyLayout.clean();

			if(status == 200) {
			    for(var i = 0; i < data.length; i++) {
				console.log(data[i]);
				var date = new Date(data[i].timestamp);
				historyLayout.addMessage({
					text:data[i].content,
					    name: data[i].username,
					    day: BootService.formatDay(date),
					    time: BootService.formatTime(date),
					    });
				console.log(data[i].type);
			    }
			}
		    });

	    }



    }]
);


