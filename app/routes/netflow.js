var Collector = require('node-netflowv9');
var dbop = require('../db/operations');
var strtools = require('../util/strtools');

var collector = Collector(function(flow){
    console.log(flow);
    var i = 0;
    for(var i = 0; i < flow.flows; i++){
        if(flow.flows.ipv4_dst_addr == '0.0.0.0') continue;
        let netref;

        dbop.findNetworkByAddr( strtools.ipToNet( flow.flows[i].ipv4_src_addr ) )
        .then(net=>{
            netref = net;
            return incNetworkBytes(netref.name, flow.flows[i].in_bytes)
        })
        .then(ok=>{
            return dbop.findUserById(netref._user)
        })
        .then(user=>{
            return updateUserBytes(user.name)
        })
        .then(updated=>{
        })
        .catch(e=>{console.log(e)})
    }
})

module.exports = {
    listen: function(port){ collector.listen(port) }
}




//     // updateUserBytes('spaceX')
//     // .then(user=>{
//     //     console.log(user.result.ok === 1);
//     // })
//     // .catch(e=>{console.log(e)})