/**
 Created by Trevor Decker on 3/22/2016
*/

var fs = require('fs');
var http = require('http');
var PublicMessage = require('../models/PublicMessage.js');
var maxAllowedMessages = 1000; 




exports.createLogFile = function(){
     fs.writeFile("MonitorLog", "Hey there!", function(err) {
	if(err) {
	    return console.log(err);
	}
	
	console.log("The file was saved!");
    });


}

function delay(delayAmount){
    var endTime = (new Date().getTime()) + delayAmount;
    while(new Date().getTime() < endTime){
	//spin
    }
}

exports.testPutMessages = function(testLength,interval,user,post,io,db){
	    var start = new Date().getTime();
		var postEnd = start + testLength;
		var postMessages = 0.0;
		while(new Date().getTime() < postEnd){
    	    //publish the message
	   		PublicMessage.create({
				author: user.id,
				    content: "12345678901234567890",
				    postedAt : new Date().getTime(),
				    });
			
			post.author = user.username;
			io.emit('public chat', post);
			delay(interval);
			//do profiling 
			postMessages = postMessages +1.0;
			if(postMessages > maxAllowedMessages){
			    socket.emit('error_test',{error:'maxAllowed'});
			    //TODO reenable the system 
			    db.run("DELETE FROM public_message WHERE content ='12345678901234567890'");
			    return;
			}
		    }
		    var postTimeEnd = Date.now();
		    var timeDiff = postTimeEnd - start;
		    var throughput = (1000.0*postMessages)/timeDiff;
		    return throughput;
}

exports.testGetMessages = function(testLength,interval,user,post,io,db){
	    var start = new Date().getTime();
		var End = start + testLength;
		var getMessages = 0.0;
		while(new Date().getTime() < End){
			delay(interval);
			    //todo read
			    db.run("SELECT * FROM public_message");
			getMessages = getMessages +1.0;
		    }
		    var TimeEnd = Date.now();
		    var timeDiff = TimeEnd - start;
		    var throughput = (1000.0*getMessages)/timeDiff;
		    return throughput;
}

exports.issuePost = function(){
    
    /*
    $http.get('/messages/public').success(function (data, status) {
	    if(status == 200) {
		for(var i = 0; i < data.length; i++) {
		    data[i].author = UserService.getById(data[i].author).username;
		}
		
	    }
	});
    */
}