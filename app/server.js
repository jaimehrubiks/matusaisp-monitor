/* 
 * Imports
****************************/
var express  = require('express'),
    app      = express(),
    passport = require('passport'),
    server   = require('http').Server(app),
    io       = require('socket.io')(server);

var database = require('./db/database'),
    config   = require('./config');

/* 
 * Start app
****************************/
database.connect();
app.set('view engine', 'ejs')

/* 
 * MiddleWare
****************************/
require('./middleware/middle_passport')(passport);       // Passport Middleware
require('./middleware/middle_express')(app);             // Express Middleware
require('./middleware/middle_io')(io);                   // io Middleware

/* 
 * Rest Routes
****************************/
app.use('/', require('./routes/index'));

/* 
 * WebSockets
****************************/
require('./routes/io')(io);

/* 
 * UDP netflow collector
****************************/
require('./routes/netflow').listen(config.netflow_port);

/* 
 * Listen
****************************/
server.listen(config.port, function () {
  console.log('Example app listening on port ' + config.port + '!');
});
