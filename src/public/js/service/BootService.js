MyApp.angular.factory('BootService', ['$document', '$http', 'UserService', function ($document, $http, UserService) {
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

        var currentPage = "login";
        pub.openPage = function(pageName, data) {
            pub.trigger('close_' + currentPage);
            MyApp.fw7.mainView.router.load({
                "pageName": pageName,
            });
            currentPage = pageName;
            pub.trigger('open_' + currentPage, data);
        }

        pub.getCurrentPage = function() {
            return currentPage;
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
