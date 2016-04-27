/**
 * Created by baishi on 2/6/16.
 */


/*************************************** Global variable defintions ********************************/
var express = require('express');
var path = require('path');
var session = require('express-session')({
    secret: 'tobereplaced',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1 * 60 * 1000 * 100
    }
});
var http = require('http');
var bodyParser = require('body-parser');
var sharedsession = require('express-socket.io-session');

var route = require('./routes/route');
var api = require('./controllers/api');

var chatPrivatelyController = require('./controllers/ChatPrivatelyController');
var chatPublicController = require('./controllers/ChatPublicController');
var userCcontroller = require('./controllers/UserController');
var announcementController = require('./controllers/AnnouncementController');
var searchController = require('./controllers/SearchController');
var roomController = require('./controllers/RoomController');
var memberController = require('./controllers/MemberController');
var roommessageController = require('./controllers/RoomMessageController');
var imageController = require('./controllers/ImageController');
var profileController = require('./controllers/ProfileController');
var adminController = require('./controllers/AdminController');
var agencyContactController = require('./controllers/AgencyContactController');
var dashboardController = require('./controllers/DashboardController');
var userHistroyController = require('./controllers/UserHistoryController');
var testController = require('./controllers/TestController');

var app = express();

//a global variable whcih tells the system if it is running or not running 
var appRunning = [true];


/**************************************************  Start up database *******************************/

//returns server port
function setup(){
    var fs = require('fs');
    var port = 4000;//default port
    for(i = 2;i<process.argv.length;i++){
        if(isNaN(process.argv[i])){
            var fs = require('fs');
            //checks to see if the user wants to force us to use a new database
            if(process.argv[i] === 'newdb'){
                console.log('creating a new db at user request');
		initDBs();
            }
        }else{
            port = Number(process.argv[i]);
        }
    }
    //creates the database if it does not exist
    console.log();
    fs.stat(path.join(__dirname, 'db/all.db'), function(err, stat) {
	    if(err == null) {
		console.log('db already exist');
	    } else {
		console.log(err);
		console.log('db does not exist so we are going to create it ');
		initDBs();
        }
    });
    return port;
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
	if ((new Date().getTime() - start) > milliseconds){
	    break;
	}
    }
}

//creates the databases locally, if they already exist then the db should be over written  
function initDBs(){
    var initdb = require('./initdb');
    sleep(1000);
    var initdata = require('./initdata').makeAdminUser();
}



/************************************************** start up server ***********************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session);

app.use('/', route);
app.use(express.static(__dirname + '/img'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/api', api);
app.use('/profile', profileController);
app.use('/admin', adminController);

//new user controller, by Yang and Yuanyuan
app.use('/users', userCcontroller);

//private chate
app.use('/messages/private', chatPrivatelyController);
app.use('/messages/public', chatPublicController);

//announcement controller
app.use('/announcements', announcementController);
app.use('/search', searchController);
app.use('/image', imageController);

app.use('/room', roomController);
app.use('/member', memberController);
app.use('/roommessage', roommessageController);

//agencyContact controller
app.use('/agencyContact',agencyContactController);

app.use('/dashboard', dashboardController);

app.use('/userhistory', userHistroyController);

var server = http.createServer(app);
var socketIO = require('./socket.js');
socketIO.init(server);
var io = socketIO.io();

io.use(sharedsession(session));


var User = require('./models/User.js');
var PublicMessage = require('./models/PublicMessage.js');
var PrivateMessage = require('./models/PrivateMessage.js');
var UserHistory = require('./models/UserHistory');

var UserDict = require('./UserDict.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname+'/db/all.db');


/*********************************************   handle client connections    **************************/
io.on('connection', function(socket) {

    //var uid = socket.handshake.session.uid;
    console.log("SESSION:");
    //var uid = socket.handshake.session.user.id;
    //console.log(uid);
    if(!socket.handshake.session.user || !socket.handshake.session.user.id) {
        socket.disconnect();
        return;
    }

    var uid = socket.handshake.session.user.id;
    console.log(uid);

    if(!uid) {
        socket.disconnect();
        return;
    }
    
    User.findOne({
	    attributes: ['id', 'username', 'createdAt', 'updatedAt', 'lastLoginAt',
			 'lastStatusCode', 'accountStatus'],
		where: {
		id : uid,
		    }
	}).then(function (user) {
		if(user == null) {
		    socket.disconnect();
		    return;
		}
		
        UserDict.add(user, socket);
        // tell other users I'm entering
        io.emit('user enter', user);
	
        socket.on('public chat', function(post) {
		if(true){//appRunning[0]){
		    PublicMessage.create({
			    author: user.id,
				content: post.content,
				postedAt: post.timestamp
				});
		    
		    UserHistory.create({
			    timestamp: new Date(),
				username: user.username,
				type: 3,
				content: post.content
				});
		    
		    post.author = user.username;
		    io.emit('public chat', post);
		}
	    });
	
        socket.on('disconnect', function(){
		console.log("a user disconnect : " + user.id);
		socket.disconnect();
		UserDict.remove(user.id, socket);
		if(!UserDict.isOnline(user.id)) {
		    // tell other users I'm leaving.
		    io.emit('user leave', user);
		}
	    });//socket.on disconnect
	
        socket.on('private message', function(post){
		if(true){//appRunning[0]){
		    //var receiver = UserDict.getUser(post.receiver_id);
		    User.findOne({
			    attributes: ['id', 'username'],
				where: {
				id: post.receiver_id,
				    }
			}).then(function(receiver){
				if(!receiver){
				    return;
				}
				
				PrivateMessage.create({
					content : post.content,
					    author : user.id,
					    target: receiver.id,
					    postedAt : post.timestamp
					    });
				
				var o = {
				    author : user.id,
				    target: receiver.id,
				    content : post.content,
				    postedAt : post.timestamp,
				}; //var o
				
				UserDict.sendTo(post.receiver_id, "private message", o);
				UserDict.sendTo(user.id, "private message", o);
			    });//User.findOne
		}
	    });//socket.on('private message')

	socket.on('stop_test',function(post){
		console.log("stoping the log");
		appRunning[0] = true;
	    });
	
	//monitor and testing system 
	socket.on('start_test',function(post){
		
		appRunning[0] = false;
		console.log('runing test duration:'+post.duration+'interval'+post.interval);
		var testLength = post.duration/2;
		
		var postThroughput  = testController.testPutMessages(testLength,post.interval,user,post,io,db,appRunning,socket);
		var getThroughput  = testController.testGetMessages(testLength,post.interval,user,post,io,db,appRunning,socket);

		//only send results if we are still testing 
		if(appRunning[0] == false){
		    console.log(postThroughput);
		    socket.emit('end_test',{
			    PostThroughput:postThroughput,
				getThroughput:getThroughput,
				
				});
		appRunning[0] = true;
		}
	    });//socket.on('start_test')
	
	    });
    });
    
    
    /*******************************************   main loop *************************************/

var port = setup();
server.listen(port, function() {
    console.log('listening on port:', port);
});
