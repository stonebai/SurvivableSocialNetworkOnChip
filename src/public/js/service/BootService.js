MyApp.angular.factory('BootService', ['$document', '$http', function ($document, $http) {
        var pub = {},
            eventListeners = {
                'ready' : []
            };
        
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

        function onReady() {
            var fw7 = MyApp.fw7;
            
            $http.get('/api/checklogin').success(function (data) {
                // if the user has logined into the system, then go to the chat room
                if (data.logined) {
                    MyApp.socket = io();
                    MyApp.username = data.username;
                    console.log(data.username);
                    fw7.app.closeModal();
                    MyApp.fw7.mainView.router.load({
                        "pageName": "public_chat"
                    });
                    pub.trigger('login');
                }
            });    
            
            fw7.views.push(fw7.app.addView('.view-main', fw7.options));
            MyApp.fw7.mainView = fw7.views[0];

            for (var i = 0; i < eventListeners.ready.length; i++) {
                eventListeners.ready[i]();
            }

            Dom7(document).on('pageInit', '.page[data-page="private"]', function (e) {
                console.log("private loadede!");
                // Do something here when page with data-page="about" attribute loaded and initialized
            })
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
