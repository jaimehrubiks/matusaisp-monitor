var os  = require('os-utils');

var stats = {};


setInterval(function(){
    os.cpuUsage( function(value) { stats.cpu = (value*100).toFixed(2) } );
    stats.freemem = (os.freemem()).toFixed(2);
    stats.totalmem = os.totalmem();
},2500);

module.exports = stats;
