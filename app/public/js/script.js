function bytesToMBs(bytes){
    return (bytes/1024/1024).toFixed(2)+' MBs'
}

module.exports = bytesToMBs;