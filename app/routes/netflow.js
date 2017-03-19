var Collector = require('node-netflowv9');
var dbop = require('../db/operations');
var strtools = require('../util/strtools');

var collector = Collector(function(flow){
    var i = 0;
    for(var i = 0; i < flow.flows.length; i++){
        if(flow.flows[i].ipv4_dst_addr == '0.0.0.0') continue;
        let netref, com = flow.flows[i];

        dbop.findNetworkByAddr( strtools.ipToNet( com.ipv4_src_addr ) )
        .then(net=>{
            netref = net;
            return dbop.incNetworkBytes(netref.name, com.in_bytes)
        })
        .then(ok=>{
            return dbop.findUserById(netref._user)
        })
        .then(user=>{
            return dbop.updateUserBytes(user.name)
        })
        .then(updated=>{
        })
        .catch(e=>{console.log(e)})
    }
})

function test(flow){
    console.log(flow);
    var i = 0;
    for(var i = 0; i < flow.flows.length; i++){
        if(flow.flows[i].ipv4_dst_addr == '0.0.0.0') continue;
        let netref, com = flow.flows[i];

        dbop.findNetworkByAddr( strtools.ipToNet( com.ipv4_src_addr ) )
        .then(net=>{
            netref = net;
            return dbop.incNetworkBytes(netref.name, com.in_bytes)
        })
        .then(ok=>{
            return dbop.findUserById(netref._user)
        })
        .then(user=>{
            return dbop.updateUserBytes(user.name)
        })
        .then(updated=>{
        })
        .catch(e=>{console.log(e)})
    }
}


// setTimeout(function(){
//    var data = { header:
//    { version: 9,
//      count: 2,
//      uptime: 104748,
//      seconds: 1014940904,
//      sequence: 1,
//      sourceId: 0 },
//   flows:
//    [ { last_switched: 77924,
//        first_switched: 59328,
//        in_bytes: 1,
//        in_pkts: 35,
//        input_snmp: 3,
//        output_snmp: 0,
//        ipv4_src_addr: '192.168.1.5',
//        ipv4_dst_addr: '192.168.0.1',
//        protocol: 1,
//        src_tos: 0,
//        l4_src_port: 0,
//        l4_dst_port: 2048,
//        flow_sampler_id: 0,
//        unknown_type_51: '00',
//        ipv4_next_hop: '0.0.0.0',
//        dst_mask: 24,
//        src_mask: 24,
//        tcp_flags: 16,
//        direction: 0,
//        dst_as: 0,
//        src_as: 0,
//        fsId: 256 } ],
//   templates: { '192.168.0.1:60681': { '256': [Object] } },
//   rinfo: { address: '192.168.0.1', family: 'IPv4', port: 60681, size: 164 },
//   }
//   test(data)
// },4000)

module.exports = {
    listen: function(port){ collector.listen(port) }
}



//     // updateUserBytes('spaceX')
//     // .then(user=>{
//     //     console.log(user.result.ok === 1);
//     // })
//     // .catch(e=>{console.log(e)})