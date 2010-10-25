var DNode = require('dnode')
,	sys = require('sys')

DNode(function (client) {
	sys.puts(sys.inspect(client));
    // Poll the client's own temperature() in celsius and convert that value to
    // fahrenheit in the supplied callback
    this.clientTempF = function (cb) {
	sys.puts(sys.inspect(client));
        client.temperature(function (degC) {
            var degF = Math.round(degC * 9 / 5 + 32);
            cb(degF);
        });
        client.temperature2(function (degC) {
            var degF = Math.round(degC * 9 / 5 + 322);
            cb(degF);
        });
    }; 
}).listen(6060);
