/**
 * Created by baishi on 2/6/16.
 */
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

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session);

app.use('/', route);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/api', api);


//new user controller, by Yang and Yuanyuan
app.use('/users', userCcontroller);

//private chate
app.use('/messages/private', chatPrivatelyController);
app.use('/messages/public', chatPublicController);

var server = http.createServer(app);

var io = require('socket.io').listen(server);
io.use(sharedsession(session));


var User = require('./models/user.js');
var PublicMessage = require('./models/PublicMessage.js');
var PrivateMessage = require('./models/PrivateMessage.js');

var UserDict = require('./UserDict.js');


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
        attributes: ['id', 'username'],
        where: {
            id : uid,
        }
    }).then(function (user) {
        if(user == null) {
            socket.disconnect();
            return;
        }

        UserDict.add(user, socket);

        socket.on('public chat', function(post) {

            PublicMessage.create({
                author: user.id,
                content: post.content,
                postedAt: post.timestamp
            });

            post.author = user.username;
            io.emit('public chat', post);
        });

        socket.on('disconnect', function(){
            console.log("a user disconnect : " + user.id);
            socket.disconnect();
            UserDict.remove(user.id, socket);
        });

        socket.on('private message', function(post){
            //var receiver = UserDict.getUser(post.receiver_id);
            User.findOne({
                attributes: ['id', 'username'],
                where: {
                    id: post.receiver_id,
                }
            }).then(function(receiver){
                if(!receiver)
                    return;

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
                };

                UserDict.sendTo(post.receiver_id, "private message", o);
                UserDict.sendTo(user.id, "private message", o);
            });
        });
    });

    socket.on('post annoucement', function(post) {
        var Annoucement = require('./models/announcement');
        Annoucement.create({
            author: post.author,
            content: post.content,
            timestamp: post.timestamp,
            location: post.location
        });
        io.emit('post annoucement', post);
    });
});

var port = process.argv.length > 2 ? Number(process.argv[2]) : 3000;
server.listen(port, function() {
    console.log('listening on port:', port);
});
