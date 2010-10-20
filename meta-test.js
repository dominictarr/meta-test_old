
var DNode = require('dnode')
,	sys = require('sys')
,	subtree = require('../helper/lib/subtree')
,	spawn = require('child_process').spawn
,	reporting = 
		function (report){
			sys.puts(sys.inspect(report));
		}



server.on('ready', function () {
	cp = spawn('node', ['./tester-client.js'])
//	cp = spawn('node', ['./tester-client.js'])
/*	cp.on('exit',function(){
		server.end();
	});*/
	cp.stdout.on('data',
		function(data){
			sys.print('child: ' + data);
		}
	);
});	

/*
server.on('ready', function () {


});*/

module.exports = function MetaTest(){

}


/**
* MetaTest
* start other nodejs processes and pass them a test to run.
* have multiple node versions
* sandbox by running as low-permission user
* report on success in each different version of node.
* i.e. 0.2.* 0.3.*
* also, extend to browsers
*
* use to test test frameworks... run tests which should give a certain result in another process,
* without two instances of the framework interfering with each other.
*/
