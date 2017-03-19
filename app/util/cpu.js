var usage = require('os-usage');

var cpuMonitor = new usage.CpuMonitor({ limit: 10, delay: 2});

var cpu = {};

cpuMonitor.on('cpuUsage', function(data) {
    cpu.total = data;
})
cpuMonitor.on('topCpuProcs', function(data) {
    cpu.procs = data;
})

module.exports = cpu;
