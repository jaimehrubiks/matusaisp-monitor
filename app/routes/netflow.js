var Collector = require('node-netflowv9');
var dbop = require('../db/operations');
var strtools = require('../util/strtools');

var collector = Collector(function(flow){
    console.log(flow);
    var i = 0;
    for(var i = 0; i < flow.flows; i++){
        if(flow.flows.ipv4_dst_addr == '0.0.0.0') continue;
        dbop.incNetworkBytesByAddr(strtools.ipToNet( flow.flows[i].ipv4_src_addr ), flow.flows[i].in_bytes)
        .then(updated=>{})
        .catch(e=>{console.log(e)})
    }
})

module.exports = {
    listen: function(port){ collector.listen(port) }
}