/**
 * Created by Edison on 2016/4/10.
 */
MyApp.angular.controller('AdminEditController',
    ['$scope', '$http', 'BootService', 'UserService',
        function($scope, $http, BootService, UserService) {

            var $$ = Dom7;
            var fw7 = MyApp.fw7.app;

            var privilegeOptions = ['Administrator', 'Coordinator', 'Monitor', 'Citizen'];

            $scope.profile = {};
            $scope.profile.avatar = 'public/img/small-default-avatar.png';

            BootService.addEventListener('open_admin_edit', function(profile){
                //if(profile.id == UserService.currentUser.id) {
                //    $$('#admin-edit-form').find('.account-status-list-item').hide();
                //    $$('#admin-edit-form').find(".privilege-list-item").hide();
                //}
                //else {
                //    $$('#admin-edit-form').find('.account-status-list-item').show();
                //    $$('#admin-edit-form').find(".privilege-list-item").show();
                //}


                BootService.setNavbarTitle("Admin");
                $http.get('/profile/' + profile.username).success(function(data){
                    $scope.profile = data;
                    console.log(data);
                }).error(function(data, status){
                    console.log(data);
                });
            });

            BootService.addEventListener('ready', function() {
                $$('#account_status_selector').on('click', function() {
                    var buttons = [
                        {
                            text: 'ACTIVE',
                            onClick: function() {
                                $scope.profile.accountStatus = 'ACTIVE';
                                $$('#account_status_selector').text('ACTIVE');
                            }
                        },
                        {
                            text: 'INACTIVE',
                            onClick: function() {
                                $scope.profile.accountStatus = 'INACTIVE';
                                $$('#account_status_selector').text('INACTIVE');
                            }
                        }
                    ];

                    fw7.actions(buttons);
                });

                $$('#privilege_selector').on('click', function() {
                    var buttons = [];
                    for (var i = 0; i < privilegeOptions.length; i++) {
                        buttons[i] = (function(i){
                            return {
                                text: privilegeOptions[i],
                                onClick: function() {
                                    $scope.profile.privilege = privilegeOptions[i];
                                    $$('#privilege_selector').text(privilegeOptions[i]);
                                }
                            }
                        })(i);
                    }

                    fw7.actions(buttons);
                });

            });

            function validatePassword(password) {
                if(password.length < 4) {
                    return false;
                }
                return true;
            }

            function alertMessage(text) {
                fw7.alert(text, "App Alert");
            }

            $scope.submit = function() {
                var o = $scope.profile;
                if( o.password && !validatePassword(o.password)) {
                    alertMessage('Password should have at least 4 characters!', 'Invalid password');
                    return;
                }

                $http.post('/admin/' + o.id, o).success(function(data){
                    console.log(data);
                    fw7.alert('The Modifications are Saved Successfully.', "App Alert");
                    BootService.openPage('profile', o.username);
                    return;
                }).error(function(data, status){
                    console.log(data);
                    alertMessage(data.msg, status);
                });
            }

            $scope.cancel = function() {
                fw7.confirm('Are you sure to give up the modification?', function () {
                    BootService.openPage('profile', $scope.profile.username);
                });
            }
        }
    ]
);