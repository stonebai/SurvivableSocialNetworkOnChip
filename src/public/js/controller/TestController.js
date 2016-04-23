/**
 * Created by Trevor Decker
 */
MyApp.angular.controller('SystemTestController',
			  ['$scope', '$http', '$rootScope','BootService', 'UserService',
			   
			   
			   function ($scope, $http, $rootScope,BootService, UserService) {
				  
				  var fw7 = MyApp.fw7.app;
				  var socket = null;
				  var messageLayout = MyApp.fw7.app.messages('#public_messages',{autoLayout:true});
				  var maxAllowedMessages = 1000;  
				  
				  // helper function getMessages
				  //param getEnd
				  //param data
				  //pram status
				  function getMessages(getEnd,data,status){
				      var messageCount = 0;
				      $http.get('/messages/public').success(function (data, status) {
					      messageCount = messageCount+1;
					      
					  });//get
				      return messageCount;
				  }
				  
				  //a helper function which will delay exectuion for a set number of miliseconds
				  // param: delayAmount, the number of milisconds to delay for 
				  function delay(delayAmount){
				      var endTime = (new Date().getTime()) + delayAmount;
				      while(new Date().getTime() < endTime){
					  //spin
				      }
				   }
				  
				  
				  $scope.onClickTestButton = function() {				      
				      var delay_time = Number(document.getElementById("interval").value);
				      var duration = Number(document.getElementById("duration").value)*1000; 
				      var testLength = duration/2;
				      fw7.alert('starting the test will run for: '+duration+" miliseconds with a delay of:"+delay_time+ " miliseconds App Alert");

				      
				      //send a request 
				      var post = {
					  duration: duration,
					  interval: delay_time,
					  timestamp: new Date(),
					  
				      }
				      socket.emit('start_test', post);
				      
				      
				      //set up finished handler 
				      socket.on('end_test',function(data){
					      
					      fw7.alert("the test has finished:\n\r post throughput: " +data.PostThroughput+ "  Messages/second     \n\r   get throughput: "+data.getThroughput+"Messages/second", "Test Result");
					      
					  });
				      
				      //tell the server side that the test is done so that th
				      socket.emit('done_test');
				      messageLayout.clean();
				      
				      //a callback for when the test has errored on the server side
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
