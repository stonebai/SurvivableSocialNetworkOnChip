var MyApp = {};

MyApp.config = {
};

MyApp.angular = angular.module('MyApp', []);

MyApp.fw7 = {
    app : new Framework7({
        animateNavBackIcon: true,
        dynamicNavbar: true,
        domCache: true,
    }),
    options : {
        dynamicNavbar: true,
        domCache: true
    },
    views : [],
};

MyApp.fw7.app.loginScreen();
MyApp.socket = null;
MyApp.username = null;


