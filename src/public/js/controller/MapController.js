/**
 * Created by Trevor Decker
 */
﻿MyApp.angular.controller('TestController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',

    function ($scope, $http, $rootScope, BootService, UserService) {
    var fw7 = MyApp.fw7.app;
	var socket = null;
	var messageLayout = MyApp.fw7.app.messages('#public_messages',{autoLayout:true});
	var maxAllowedMessages = 1000;  
	

	window.onload = start();
         
	function start(){

	    navigator.geolocation.getCurrentPosition(foundLocation, noLocation);
            function foundLocation(position) {
		
		
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		var post = {
		    //TODO also send the user
		    lat: lat,
		    long: long,
		}

		socket.emit('user_lat_lon', post);
        addMarker(lat,long); 


		//		alert("lat:"+lat+" long:"+long);
		//TODO send  a messge for the current location 

	    }

	    function noLocation() {
		alert('warning could not find your location so you will not be shown online ');
	    }
	    
	    //	    document.getElementById('longitude').innerHTML = position.coords.longitude;

	    //	    fw7.alert('This is a test of the map', "App Alert");
    
//TODO add diifrent color markers
//TODO make markers clickable to the correct address 
//TODO make location update automatically
   $http.get("/users").success(function(users, status){
   	for(var i = 0;i<users.length;i++){	
       addMarker(40.4424241+Math.random()/10000	,-79.9490967+Math.random()/10000,i,users[i].username,users[i].lastStatusCode);
	}
   });
	


	}

	function addMarker(lat_,lon_,i,name,statusCode){
		var mdiv = "mdiv";
		var id = mdiv.concat(i.toString());
	   
	    var src = document.getElementById("markerdiv");
        var img = document.createElement("img");
        if(statusCode == "GREEN"){
        img.src = "greenpin.png";
	}else if(statusCode == "RED"){
   	    img.src = "redpin.png";
	}else{
	    img.src ="yellowpin.png";
	}
        img.id = id;
        img.alt=name;
        src.appendChild(img);
 


        var stra = "#";
        var myElement = document.querySelector(stra.concat(id));
		myElement.style.position = "fixed";
		var x = (lon_+79.9494697)/.000105; //97.1921*(-lon_ - 79.9504487);
		var y = (lat_ - 40.4405251)/0.000047;
		myElement.style.left = x.toString().concat("%");
		myElement.style.bottom = y.toString().concat("%");
	    myElement.style.width = "50px";
	    myElement.style.height = "50px";


		img.onclick = function() {
		 window.location.href = "http://localhost:4000/";
		};


	}


}]);

