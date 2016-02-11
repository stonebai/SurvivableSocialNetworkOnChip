/**
 * Created by baishi on 2/6/16.
 */
var express = require('express');
var path = require('path');
var session = require('express-session');
var http = require('http');
var bodyParser = require('body-parser');

var route = require('./routes/route');
var api = require('./controllers/api');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'tobereplaced',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1 * 60 * 1000
    }
}));

app.use('/', route);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/api', api);

var server = http.createServer(app);
var port = process.argv.length > 2 ? Number(process.argv[2]) : 3000;
server.listen(port, function() {
    console.log('listening on port:', port);
})