var DNode = require('dnode');

DNode({
    // Compute the client's temperature and stuff that value into the callback
    temperature : function (cb) {
        var degC = Math.round(20 + Math.random() * 10 - 5);
        console.log(degC + '° C');
        cb(degC);
    },
    temperature2 : DNode.sync(function (cb) {
        var degC = Math.round(200 + Math.random() * 10 - 5);
        console.log(degC + '° C');
        return degC;
    })
}).connect(6060, function (remote) {
    // Call the server's conversion routine, which polls the client's
    // temperature in celsius degrees and converts to fahrenheit
    remote.clientTempF(function (degF) {
        console.log(degF + '° F');
    });
});
