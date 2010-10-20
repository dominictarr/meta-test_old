var DNode = require('dnode')
,	sys = require('sys')
,	subtree = require('../helper/lib/subtree')
,	spawn = require('child_process').spawn
,	reporting = 
		function (report){
			sys.puts(sys.inspect(report));
		}
,  server = DNode(function (client,con){
//		sys.puts("connected:" + sys.inspect(con));
		this.hello = function(name,cb){
			sys.puts("client connected:" + sys.inspect(client));
			client.runRequire(
				'../node-async-testing/test/test-errors.js'
			,	{	onSuiteDone: 
						function (report){
							var results = { 
								tests:[//  Cannot read property 'UEHandler' of undefined...not very good error message.
									{	name:	'test sync error'
									,	status: 'error'
									/*,	failure:{
											message: 'fail'
										,	name: 'AssertionError'
										}*/
									}
								,	{	name:	'test async error'
									,	status: 'error'
									}
								]
							}
							sys.puts("report:" + sys.inspect(report));
							subtree.assert_subtree(results,report);
							sys.puts("PASS!");
						}
				}
			);
//			client.run('../node-async-testing/test/test-testing.js',{});
				
			cb("hello," + name);
		}
	}).listen(6060);



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
