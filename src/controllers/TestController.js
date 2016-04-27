/**
 Created by Trevor Decker on 3/22/2016
*/
var fs = require('fs');
var http = require('http');

//we are makeing public messages so we need to use the Public message model 
var PublicMessage = require('../models/PublicMessage.js');


//variable for the number of requests we will make before the test fails
//this is a system requierment and to stop the system from having to store 
//too many messages 
var maxAllowedMessages = 1000; 

//this function delays execution of the program for a set amount of time
//param: delayAmount the number of milliseconds that the system wants to delay for  
function delay(delayAmount){
    var endTime = (new Date().getTime()) + delayAmount;
    var now = new Date().getTime();
    var dt = endTime - now;
    // defer the execution of anonymous function for dt
    while(new Date().getTime() < endTime){
	//spin
    }//while
}//delay

//public function that attempts to see how often a test message can be put 
//param: testLegnth the number of miliseconds in the test
//param: interval   the number of miliseconds between test
//param: the user to push the messages with
//param: the post to for the message
//param: a refrence to the io controller
//param: the db that the messages are being added to 
exports.testPutMessages = function(testLength,interval,user,post,io,db,appRunning,socket){
    var start = new Date().getTime();
    var postEnd = start + testLength;
    var postMessages = 0.0;
    var now = new Date().getTime();
    while(now < postEnd && !appRunning[0]){
	console.log("appRunning:"+appRunning[0]);
	console.log("put timeRemaning:"+(postEnd-now));
	//publish the message
	/*
	PublicMessage.create({
		author: user.id,
		    content: "12345678901234567890",
		    postedAt : new Date().getTime(),
		    });
	*/
	post.author = user.username;
	//	io.emit('public chat', post);
	delay(interval);
	//do profiling 
	postMessages = postMessages +1.0;
	if(postMessages > maxAllowedMessages){
	    socket.emit('error_test',{error:'maxAllowed'});
	    db.run("DELETE FROM public_message WHERE content ='12345678901234567890'");
	    appRunning[0] = true;
	    return;
	}//if
		    now = new Date().getTime();
    }//while
    var postTimeEnd = Date.now();
    var timeDiff = postTimeEnd - start;
    var throughput = (1000.0*postMessages)/timeDiff;
    return throughput;
};//testPutMEssages
    
//public function testGetMessges
//param: testLegnth
//param: interval
//param: user
//param: post
//param: io
//param: db
exports.testGetMessages = function(testLength,interval,user,post,io,db,appRunning,socket){
    var start = new Date().getTime();
    var putEnd = start + testLength;
    var getMessages = 0.0;
    var now = new Date().getTime();
    while(now < putEnd && !appRunning[0]){
	console.log("get timeRemaning:"+(putEnd-now));
	delay(interval);
	//todo read
	db.run("SELECT * FROM public_message");
	getMessages = getMessages +1.0;
	now = new Date().getTime();
    }
    var TimeEnd = Date.now();
    var timeDiff = TimeEnd - start;
    var throughput = (1000.0*getMessages)/timeDiff;
    //removes all elements from the history 
    db.run("DELETE FROM public_message WHERE content ='12345678901234567890'");
    
    return throughput;
};//testGetMessages
