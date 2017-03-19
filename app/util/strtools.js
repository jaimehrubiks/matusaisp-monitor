module.exports = {};

module.exports.ipToNet = function(ip){
    var regex = /((?:\d{1,3}\.){3})/
    var match = regex.exec(ip);
    if(match) return match[1] + '0';
    return -1;
}