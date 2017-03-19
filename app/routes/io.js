var passportSocketIo = require("passport.socketio"),
    cpu = require('../util/cpu')

module.exports = function(io){

    io.on('connection', function(socket){
        socket.on('chat message', function(msg){
            console.log('got: '+ msg);
            io.emit('chat message', msg);
        });
    });

    setInterval(function(){
        passportSocketIo.filterSocketsByUser(io, function(user){
            return user.admin === true;
        }).forEach(function(socket){
            socket.emit('cpu', cpu);
        });
    },3000);

}