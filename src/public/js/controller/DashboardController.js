MyApp.angular.controller('DashboardController',
['$scope', '$http', '$window', 'BootService', 'UserService',
function ($scope, $http, $window, BootService, UserService) {
    $scope.type = "/users";

    $http.get('/dashboard/request').success(function(data, status){
        console.log(status);

        if(status == 200){
            $scope.data = data;
            console.log(data);

            //set the line chart
            var line_labels = [];
            var line_data = [];
            var show_data = [];
            for(date in data){
                line_labels.push(date);
                if($scope.type != "ALL"){
                    show_data.push(data[date][$scope.type]);
                }else{
                    var count = 0;
                    for(type in data[date]){
                        count += data[date][type];
                    }
                    console.log(count);
                    show_data.push(count);
                }
            }
            line_data.push(show_data);
            $scope.line_labels = line_labels;
            $scope.line_data = line_data;
            $scope.line_series = [$scope.type];

            //set the bar chart
            $scope.bar_labels = ["Request Amount"];
            $scope.bar_series = ['/users', '/messages/public', '/messages/private',
                '/announcements', '/search'];

            var count = {
                '/users': 0,
                '/messages/public': 0,
                '/messages/private': 0,
                '/announcements': 0,
                '/search': 0
            };

            for(date in data){
                for(type in data[date]){
                    count[type] += data[date][type];
                }
            }

            $scope.bar_data = [
                [count['/users']],
                [count['/messages/public']],
                [count['/messages/private']],
                [count['/announcements']],
                [count['/search']],
            ];

            //set the pie chart
            $scope.pie_labels = ["/users", "/messages/public", "/messages/private",
                "/announcements", "search"];

            $scope.pie_data = [count['/users'], count['/messages/public'],
                count['/messages/private'], count['/announcements'], count['/search']];
        }
    });

    $scope.selectChange = function(){
        var data = $scope.data;
        $scope.line_labels = [];
        var line_labels = [];
        var line_data = [];
        var show_data = [];
        for(date in data){
            line_labels.push(date);
            if($scope.type != "ALL"){
                show_data.push(data[date][$scope.type]);
            }else{
                var count = 0;
                for(type in data[date]){
                    count += data[date][type];
                }
                console.log(count);
                show_data.push(count);
            }
        }
        $scope.line_labels = line_labels;
        $scope.line_data = [show_data];
        $scope.line_series = [$scope.type];
    }
}]);
