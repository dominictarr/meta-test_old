
var  x
DNode = require('dnode')
, client = require('async_testing')
, sys = require('sys');

client.runRequire = function(filename,options){
	client.runSuite(require(filename),options);
}

DNode(client).connect(6060, function(remote){
	remote.hello("bill",
		function(x){
			sys.puts(x);
		});
});
/*
client.runSuite('./test-subtree.js',{
		onSuiteDone: 
			function (report){
				sys.puts(sys.inspect(report));		
			}
	});
*/
