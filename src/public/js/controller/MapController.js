/**
 * Created by Trevor Decker
 */

	
MyApp.angular.controller('MapController',
    ['$scope', '$http', '$rootScope', 'BootService', 'UserService',

    function ($scope, $http, $rootScope, BootService, UserService) {
    var fw7 = MyApp.fw7.app;
    var socket = null;
    var messageLayout = MyApp.fw7.app.messages('#public_messages',{autoLayout:true});
    var maxAllowedMessages = 1000;  
 
    window.onload = start();
    
    function start(){

	navigator.geolocation.getCurrentPosition(foundLocation, noLocation);

	BootService.addEventListener('login', function () {
		
		socket = MyApp.socket;
	    });
	

            function foundLocation(position) {
		
		
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		var post = {
		    //TODO also send the user
		    lat: lat,
		    long: long,
		}
		
		if(socket != null){
		    socket.emit('user_lat_lon', post);
		}
		if(lat != null && long != null){
		} 
	    }
	    
	    function noLocation() {
		alert('warning could not find your location so you will not be shown online ');
	    }
	    
	    
	    //TODO make markers clickable to the correct address
	    //TODO add filter buttons
	    //TODO make location update automatically do this by periodic socket comunication 
	    $http.get("/users").success(function(users, status){
		    for(var i = 0;i<users.length;i++){	
			addMarker(users[i].lat,users[i].lng,i,users[i].username,users[i].lastStatusCode);
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
		var x = (lon_+79.9494697)/.000105;
		var y = (lat_ - 40.4405251)/0.000047;
		myElement.style.left = x.toString().concat("%");
		myElement.style.bottom = y.toString().concat("%");
		myElement.style.width = "50px";
		myElement.style.height = "50px";
		
		
		img.onclick = function() {
		    BootService.openPage('private_chat', i);
		
		    //    window.location.href = "http://localhost:4000/";
		};
		

    }
    
	}]);

