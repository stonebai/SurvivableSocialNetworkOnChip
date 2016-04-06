/**
 * Created by Edison on 2016/4/4.
 */
MyApp.angular.controller('EditProfileController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',
        function ($scope, $http, $rootScope, BootService, UserService) {

            var $$ = Dom7;
            var fw7 = MyApp.fw7.app;

            $scope.profile = {};
            $scope.profile.avatar = 'public/img/small-default-avatar.png';

            function validateEmail(email)
            {
                var re = /\S+@\S+\.\S+/;
                return re.test(email);
            }

            function validatePhoneNumber(phone) {
                var d = '01234567890- ';
                for (var i = 0; i < phone.length; i++) {
                    if(d.indexOf(phone[i]) === -1)
                        return false;
                }
                return true;
            }

            function validateAge(age) {
                return !isNaN(parseInt(age));
            }

            BootService.addEventListener('ready', function(){
                $$('#gender-selector').on('click', function(){
                    var buttons = [{
                        text: "Male",
                        onClick: function() {
                            $scope.profile.gender = 'Male';
                            $scope.$apply();
                        }
                    }, {
                        text: 'Female',
                        onClick: function() {
                            $scope.profile.gender = 'Female';
                            $scope.$apply();
                        }
                    }];

                    fw7.actions(buttons);
                });
            });

            $scope.getGenderText = function() {
                if($scope.profile.gender == null) {
                    return "Not Selected";
                }
                return $scope.profile.gender;
            }

            BootService.addEventListener('open_edit_profile', function(){
                var username = UserService.currentUser.username;
                var url = '/profile/' + username;
                $http.get(url).success(function(data){
                    $scope.profile = data;
                    console.log(data);
                }).error(function(data, status){
                    console.log(data);
                });
            });

            function alertMessage(text) {
                fw7.alert(text, "App Alert");
            }

            $scope.submit = function() {
                console.log($scope.profile);
                var o = $scope.profile;

                if(o.email && !validateEmail(o.email)) {
                    alertMessage('Email format is invalid');
                    return;
                }

                if(o.phone && !validatePhoneNumber(o.phone)) {
                    alertMessage('Phone Number is invalid');
                    return;
                }

                if(o.age && !validateAge(o.age)) {
                    alertMessage('Age is invalid');
                    return;
                }

                $http.post('/profile', o).success(function(data){
                    console.log(data);
                    fw7.alert('The Modifications are Saved Successfully.', "App Alert");
                    BootService.openPage('profile');
                    return;
                }).error(function(data, status){
                    console.log(status);
                });
            }

            $scope.cancel = function() {
                fw7.confirm('Are you sure to give up the modification?', function () {
                    BootService.openPage('profile');
                });
            }

            var uploadImage = function () {
                var data, xhr;
                data = new FormData();
                data.append( 'file', $$('#uploadAvatarInput')[0].files[0]);
                xhr = new XMLHttpRequest();
                xhr.open('POST', '/profile/avatar', true );
                xhr.onreadystatechange = function ( response ) {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var resObj = JSON.parse(xhr.responseText);
                        console.log(resObj.url);
                        $scope.profile.avatar = resObj.url;
                        $scope.$apply();
                    }
                };
                xhr.send( data );
            }

            $$('#uploadAvatarInput').on('change', function(){
                uploadImage();
            });

            $scope.onClickUploadAvatar = function() {
                $$('#uploadAvatarInput').click();
            }


        }]
);


