MyApp.angular.factory('BootService', ['$document', '$http', '$rootScope', 'UserService',
    function ($document, $http, $rootScope, UserService) {
        var pub = {},
            eventListeners = {
                'ready' : []
            };

        var $$ = Dom7;
        
        pub.addEventListener = function (eventName, listener) {
            if (!eventListeners[eventName])
                eventListeners[eventName] = [];
            eventListeners[eventName].push(listener);
        };
        
        pub.trigger = function (eventName, data) {
            console.log('event ' + eventName + " is triggered");
            if (!(eventName in eventListeners))
                return;
            var listeners = eventListeners[eventName];
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](data);
            }
        };

        MyApp.fw7.pages = ['login'];
        pub.openPage = function(pageName, data) {
            var currentPage = MyApp.fw7.pages[0];
            pub.trigger('close_' + currentPage);
            MyApp.fw7.mainView.router.load({
                "pageName": pageName,
            });
            currentPage = pageName;
            MyApp.fw7.pages = [currentPage];
            pub.trigger('open_' + currentPage, data);
        }

        pub.getCurrentPage = function() {
            return MyApp.fw7.pages[0];
        }

        pub.setNavbarTitle = function(title) {
            $$('.navbar').find('.center').text(title);
        }

        pub.connect = function() {
            //if(!MyApp.socket) {
            //    MyApp.socket = io.connect(window.location.origin);
            //}
            //else {
            //    MyApp.socket.connect();
            //}
            MyApp.socket = io.connect(window.location.origin, {'forceNew': true});
        }

        pub.pushPage = function(pageName, data) {
            var pages = MyApp.fw7.pages
            MyApp.fw7.mainView.router.load({
                "pageName": pageName,
            });
            pages.push(pageName);
            $rootScope.isPagePushed = true;
            pub.trigger('open_' + pageName, data);
        }

        pub.popPage = function() {
            var pages = MyApp.fw7.pages
            pages.pop();
            var pageName = pages[pages.length - 1];
            MyApp.fw7.mainView.router.back();

            if(pages.length == 1)
                $rootScope.isPagePushed = false;

            pub.trigger('open_' + pageName);
        }

        function add0(m) {
            return m < 10 ? '0' + m : m
        }

        pub.formatDate = function(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate() + 1;
            var h = date.getHours() + 1;
            var mm = date.getMinutes() + 1;
            var s = date.getSeconds() + 1;
            return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
        }

        function onReady() {
            var fw7 = MyApp.fw7;

            $http.get('/api/checklogin').success(function (data, status) {
                // if the user has logined into the system, then go to the chat room
                if(status == 200) {
                    //MyApp.socket = io();
                    pub.connect();
                    console.log(data);
                    UserService.currentUser = data;
                    fw7.app.closeModal();
                    pub.openPage('public_chat');
                    $http.get("/users").success(function(users, status){
                        if(status == 200) {
                            UserService.addUsers(users);
                            pub.trigger('login');
                        }
                    });
                }
            });
            
            fw7.views.push(fw7.app.addView('.view-main', fw7.options));
            MyApp.fw7.mainView = fw7.views[0];

            for (var i = 0; i < eventListeners.ready.length; i++) {
                eventListeners.ready[i]();
            }

        }

        function logout() {
            MyApp.fw7.app.loginScreen();
            //MyApp.socket.close();
            MyApp.socket.disconnect();
            //MyApp.socket.conn.close()
            //MyApp.socket = null;
        }

        pub.addEventListener('logout', logout);
        
        $document.ready(function () {
            // Web browser
            console.log("Using web browser setting");
            onReady();
        });
        return pub;

    }
]);
