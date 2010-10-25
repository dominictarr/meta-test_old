
var DNode = require('dnode')
, asynct = require('async_testing')
, sys = require('sys')
, client

asynct.runRequire = function(filename,options){
	sys.puts("runRequire(" + filename + "," + sys.inspect(options) + ")");
	
	asynct.runSuite(require(filename),options);
}

/*function makeClient(port,ready){
	DNode(asynct).connect(6060, function(remote){
	console.log(sys.inspect(client));
		remote.hello(client)
	});
}*/

exports.connect = function (port,go){
	DNode(asynct).connect(port, function(remote){
	console.log(sys.inspect(client));
		go && go(remote);
		remote.handshake(client);
	});
}

if (module == require.main) {
	exports.connect(6060);
}

/*
dnode is breaking async_testing because it takes over process.on('uncaughtError',func)
//test to investigate how many errors we can have?

*/
