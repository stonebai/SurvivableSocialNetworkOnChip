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

        function onReady() {
            var fw7 = MyApp.fw7;
            
            $http.get('/api/checklogin').success(function (data) {
                // if the user has logined into the system, then go to the chat room
                if (data.logined) {
                    //MyApp.socket = io(window.location.origin, {query: "uid=" + data.user.id});
                    MyApp.socket = io();
                    console.log(data.user);
                    UserService.currentUser = data.user;
                    fw7.app.closeModal();
                    pub.openPage('public_chat');
                    pub.trigger('login');
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
            MyApp.socket.close();
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
