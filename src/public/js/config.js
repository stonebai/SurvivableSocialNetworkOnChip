var MyApp = {};

MyApp.config = {
};

MyApp.angular = angular.module('MyApp', ['chart.js']);

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
    pages : [],
};

MyApp.fw7.app.loginScreen();
MyApp.socket = null;
