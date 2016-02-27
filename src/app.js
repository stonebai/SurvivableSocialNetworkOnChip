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

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session);

app.use('/', route);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/api', api);

var server = http.createServer(app);

var io = require('socket.io').listen(server);
io.use(sharedsession(session));


var User = require('./models/user.js');
var UserDict = require('./UserDict.js');

io.on('connection', function(socket) {

    //var uid = socket.handshake.session.uid;
    console.log("SESSION:");
    console.log(socket.handshake.session.uid);
    var uid = socket.handshake.session.uid;

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
            var Message = require('./models/message');
            Message.create({
                author: post.author,
                content: post.content,
                timestamp: post.timestamp
            });
            io.emit('public chat', post);
        });

        socket.on('disconnect', function(){
            console.log("a user disconnect : " + user.id);
            UserDict.remove(user.id, socket);
        });

        socket.on('private message', function(post){
            var receiver = UserDict.getUser(post.receiver_id);
            if(!receiver)
                return;
            var o = {
                sender: user,
                receiver: receiver,
                content : post.content,
                timestamp: post.timestamp
            };
            UserDict.sendTo(post.receiver_id, "private message", o);
            UserDict.sendTo(user.id, "private message", o);
        });
    });
});

var port = process.argv.length > 2 ? Number(process.argv[2]) : 3000;
server.listen(port, function() {
    console.log('listening on port:', port);
});