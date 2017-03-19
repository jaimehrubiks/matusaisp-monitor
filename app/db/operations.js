var database = require('./database');
var db = database.db;

module.exports = {};

module.exports.findAllUsers = function(){
    var collection = db().collection('users');
    return collection.find( {admin: { $ne: true} }, { pwd: 0 }).toArray()
}
module.exports.findAllNetworks = function(){
    var collection = db().collection('networks');
    return collection.find( {}, { _user: 0 }).toArray()
}
module.exports.findUserByName = function(username){
    var collection = db().collection('users');
    return collection.findOne({
        name: username
    })
}
module.exports.findNetworkByName = function(netname){
    var collection = db().collection('networks');
    return collection.findOne({
        name: netname
    })
}
module.exports.findNetworksByUserId = function(userid){
    var collection = db().collection('networks');
    return collection.find({
        _user: userid
    }).toArray()
}
module.exports.incNetworkBytes = function(netname, newbytes){
    var collection = db().collection('networks');
    return collection.updateOne(
        { name: netname },
        { $inc: { bytes: newbytes }}
    )
}
module.exports.incNetworkBytesByAddr = function(addr, newbytes){
    var collection = db().collection('networks');
    return collection.updateOne(
        { address: addr },
        { $inc: { bytes: newbytes }}
    )
}
module.exports.setUserBytes = function(userid, totalbytes){
    var collection = db().collection('users');
    return collection.updateOne(
        { _id: userid },
        { $set: { bytes: totalbytes }}
    )
}
module.exports.updateUserBytes = function(username){
    let userref;
    return findUserByName(username)
    .then(user=>{
        userref = user;
        return findNetworksByUserId(user._id);
    })
    .then(networks=>{
        let bytes = 0;
        for(net of networks) bytes += net.bytes;
        return bytes;
    })
    .then(bytes=>{
        return setUserBytes(userref._id, bytes);
    })
}

module.exports.createUser = function(user){
    var collection = db().collection('users');
    return collection.insert(user)
}

module.exports.createNetwork = function(network, _user){
    var collection = db().collection('networks');
    network._user = _user;
    return collection.insert(network)
}

module.exports.createDefault = function(){
    let ref;
    createUser(user1)
    .then(user1=>{
        console.log(user1.ops[0])
        return createNetwork(network1, user1.ops[0]._id)
    })
    .then(net1=>{
        console.log(net1.ops[0]);
        return createUser(user2);
    })
    .then(user2=>{
        console.log(user2.ops[0])
        return Promise.all([
            createNetwork(network2, user2.ops[0]._id),
            createNetwork(network3, user2.ops[0]._id)
        ])
    })
    .then(networks=>{
        //console.log(networks)
        for(let i = 0; i < networks.length; i++) console.log(networks[0].ops[0])
    })
    .catch(e=>{console.log(e)})

}


var user1 = {
    name: 'matusaISP',
    pwd: '1234',
    bytes: 900000000,
    totalBytes: 1000000000,
    active: true
}
var user2 = {
    name: 'spaceX',
    pwd: '12345',
    bytes: 900000000,
    totalBytes: 1000000000,
    active: true
}
var network1 = {
    name: 'Sede Central matusaISP',
    address: '192.168.0.0',
    int: '0/0',
    bytes: 30000000,
    active: true
}
var network2 = {
    name: 'Sede Central spaceX',
    address: '192.168.1.0',
    int: '0/0',
    bytes: 40000000,
    active: true
}
var network3 = {
    name: 'spaceX atlanta',
    address: '192.168.2.0',
    int: '0/1',
    bytes: 60000000,
    active: true
}
// setTimeout(function(){
//     console.log('doing work')
//     //createDefault();

//     // findUserByName('matusaISP')
//     // .then(user=>console.log(user))
//     // .catch(e=>console.log(e))

//     // findNetworkByName('Sede Central matusaISP')
//     // .then(user=>console.log(user))
//     // .catch(e=>console.log(e))
    
//     // findUserByName('spaceX')
//     // .then(user=>findNetworksByUserId(user._id))
//     // .then(nets=>{
//     //     for(net of nets) console.log(net)
//     // })
//     // .catch(e=>console.log(e))


//     // incNetworkBytes('Sede Central spaceX', 5)
//     // .then(updated=>{
//     //     console.log(updated.result.ok === 1)
//     // })

//     // updateUserBytes('spaceX')
//     // .then(user=>{
//     //     console.log(user.result.ok === 1);
//     // })
//     // .catch(e=>{console.log(e)})
// },2000)
