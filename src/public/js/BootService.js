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
                    pub.trigger('login');
                }
            });    
            
            fw7.views.push(fw7.app.addView('.view-main', fw7.options));
            
            for (var i = 0; i < eventListeners.ready.length; i++) {
                eventListeners.ready[i]();
            }
        }
        
        $document.ready(function () {
            // Web browser
            console.log("Using web browser setting");
            onReady();
        });
        return pub;

    }
]);
