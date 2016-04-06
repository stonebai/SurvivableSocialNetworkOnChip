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
	
	function getMessages(getEnd,data,status){
		var messageCount = 0;
	      $http.get('/messages/public').success(function (data, status) {
	       	/*
                if(status == 200) {
                    for(var i = 0; i < data.length; i++) {
                        data[i].author = UserService.getById(data[i].author).username;
						messageCount = messageCount+1;
						//check time to make sure we are not over
						if(new Date().getTime() < getEnd){
			    			break;   
						}//if
					}//for
                }//if(status)
                */
       						messageCount = messageCount+1;

		});//get
			return messageCount;
	}


	function delay(delayAmount){
	    var endTime = (new Date().getTime()) + delayAmount;
	    while(new Date().getTime() < endTime){
		//spin
	    }
	}

         
       $scope.onClickTestButton = function() {
	   fw7.alert('starting the test', "App Alert");


	   var delay_time = Number(document.getElementById("interval").value);
	   var duration = Number(document.getElementById("duration").value)*1000; //$scope.keyword.replace('/', ' ').trim();
	   var testLength = duration/2;

	  	//send a request 
        var post = {
		duration: duration,
		interval: delay_time,
                timestamp: new Date(),

            }
	   socket.emit('start_test', post);
	   

	   //set up finished handler 
	   socket.on('end_test',function(data){

     	/*   var numGetMessages = 0;
   	   	   var start = new Date().getTime();
		   var postEnd = start + testLength;
		   var now = new Date().getTime();
		   while(now < postEnd){
	     	   numGetMessages = numGetMessages + getMessages(postEnd,data,status);
			   now = new Date().getTime();
	        }
		   //remove messages locally
		   messageLayout.clean();
		   messageLayout.scrollMessages();
		   var getThroughput = numGetMessages/duration;*/




	   fw7.alert("the test has finished:\n\r post throughput: " +data.PostThroughput+ "  Messages/second     \n\r   get throughput: "+data.getThroughput+"Messages/second", "Test Result");



	   //setup timeing 

//	   var postMessages = 0;
	   /*
	   while(new Date().getTime() < postEnd){
	       var post = {
		   author: UserService.currentUser.username,
		   content: "12345678901234567890",
		   timestamp: new Date(),
	       }
	       socket.emit('public chat', post);
	       $scope.post = "";
	       delay(delay_time);
	   }
	   */
	   /*
	   var postTimeEnd = Date.now();
	   var getTimeStart = Date.now();
	   var getEnd = getTimeStart + testLength;
	   var getMessages = duration/delay_time;
	  
	   //	   while(new Date().getTime() < getEnd){
	   for(i = 0;i<10;i++){

		   });
	   }
	   var getThroughput = 1000*getMessages/testLength;
	   var putThroughput = 1000*data.PostMessages/testLength;
	   fw7.alert("the test has finished:\t \t \t\t\t\n put throughput: " +putThroughput+ "Messages/second     \n   get throughput: "+getThroughput+"Messages/second", "Test Result");
*/
	       });

	   socket.emit('done_test');

	   socket.on('error_test',function(data){
		   fw7.alert('an error was recieved ending testing',"App Alert");
		   //remove messages locally
		   messageLayout.clean();
		   messageLayout.scrollMessages();
	       });
     	}


       
        BootService.addEventListener('login', function () {
            socket = MyApp.socket;
            
        });

}]);
