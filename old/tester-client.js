
var DNode = require('dnode')
, client = require('async_testing')
, sys = require('sys');

client.runRequire = function(filename,options){
	sys.puts("runRequire(" + filename + "," + sys.inspect(options) + ")");
	
	client.runSuite(require(filename),options);
}

DNode(client).connect(6060, function(remote){
console.log(sys.inspect(client));
	remote.hello(client)
});

/*
client.runSuite('./test-subtree.js',{
		onSuiteDone: 
			function (report){
				sys.puts(sys.inspect(report));		
			}
	});
*/
