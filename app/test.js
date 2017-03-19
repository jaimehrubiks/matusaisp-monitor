var database = require('./db/database');
database.connect();
//var assert = require('assert');
var db = database.db;


function findUserByName(username){
    var collection = db().collection('users');
    return collection.findOne({
        name: username
    })
}
function findNetworkByName(netname){
    var collection = db().collection('networks');
    return collection.findOne({
        name: netname
    })
}
function findNetworksByUserId(userid){
    var collection = db().collection('networks');
    return collection.find({
        _user: userid
    }).toArray()
}
function incNetworkBytes(netname, newbytes){
    var collection = db().collection('networks');
    return collection.updateOne(
        { name: netname },
        { $inc: { bytes: newbytes }}
    )
}
function setUserBytes(userid, totalbytes){
    var collection = db().collection('users');
    return collection.updateOne(
        { _id: userid },
        { $set: { bytes: totalbytes }}
    )
}
function updateUserBytes(username){
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

function createUser(user){
    var collection = db().collection('users');
    return collection.insert(user)
}

function createNetwork(network, _user){
    var collection = db().collection('networks');
    network._user = _user;
    return collection.insert(network)
}

function createDefault(){
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
