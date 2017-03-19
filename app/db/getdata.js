var dbop = require('./operations');

module.exports = {};

module.exports.getAdminData = function(){
    
    return new Promise(function (resolve, reject) {
    
        var data = {};

        Promise.all([
            dbop.findAllUsers(),
            dbop.findAllNetworks()
        ])
        .then(_data=>{
            data.users = _data[0];
            data.networks = _data[1];
            resolve(data);
        })
        .catch(e=>{
            reject(e)
        })

    })

}


module.exports.getUserData = function(name){
    
    return new Promise(function (resolve, reject) {
    
        var data = {};

        dbop.findUserByName(name)
        .then(user=>{
            data.user = user;
            return dbop.findNetworksByUserId(user._id)
        })
        .then(networks=>{
            data.networks = networks;
            resolve(data);
        })
        .catch(e=>{
            console.log(e)
            reject(e)
        })


    })

}