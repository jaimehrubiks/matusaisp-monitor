function ipToNet(ip){
    var regex = /((?:\d{1,3}\.){3})/
    var match = regex.exec(ip);
    if(match) return match[1] + '0';
    return -1;
}

console.log( ipToNet('192.162.0.1') )
