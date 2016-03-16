
var router = require('express').Router();
var PublicMessage = require('./models/PublicMessage.js');

var testDuration = 1000; //miliseconds
var testInterval = 10;  //miliseconds
var maxAllowedMessages = 100000; //messages
var putMessages = 0;
var getMessages = 0;

console.log('Starting Monitoring Test');
console.log('test Duration: %d',testDuration);
console.log('test Interval: %d',testInterval);
console.log('maxAllowedMessages: %d',maxAllowedMessages);




var testTimeStart = Date.now(); 
//TODO create a user
//TODO set the message

var postTimeStart = Date.now();

var start = new Date().getTime();
while(new Date().getTime() < start + testDuration) {
    //put message
    PublicMessage.create({
	    author: 0, 
                content: "post.content",
                postedAt: Date.now
		});
    putMessages = putMessages+1;
}

var postTimeEnd = Date.now();
var getTimeStart = Date.now();


var start = new Date().getTime();
while(new Date().getTime() < start + testDuration) {
    //get request

router.get('/', function(req, res) {
    PublicMessage.findAll({
        order: 'postedAt ASC'
    }).then(function(messages) {
        res.status(200).json(messages);
    });
});

router.get('/:count', function(req, res){});
    getMessages = getMessages +1;

}




var getTimeEnd = Date.now();
var testTimeEnd = Date.now();
var testTime = testTimeEnd - testTimeStart;
var postTime = postTimeEnd - postTimeStart;
var getTime = getTimeEnd - getTimeStart;
console.log("totalTime: %d ms, getTime: %d ms, postTime: %d ms, puts %d, gets %d",testTime,getTime,postTime,putMessages,getMessages); 

