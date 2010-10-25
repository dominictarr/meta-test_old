
var DNode = require('dnode')
,	sys = require('sys')
,	subtree = require('../helper/lib/subtree')
,	spawn = require('child_process').spawn
,	reporting = 
		function (report){
			sys.puts(sys.inspect(report));
		}
,	onReady = []
,	client
,	server
,	cp = null;

function start_child(){
	cp = spawn('node', ['./meta-test-runner.js'])
	cp.stdout.on('data' , function(data){
			sys.print('RUNNER: ' + data);
		}
	);
}
start_child();

function readyNotify(){
	onReady.forEach(function(e){
		e(client);
	});
	onReady = [];
}


function MetaTestServer(server){
	this.runRequire = function(file,opts){
		sys.puts("XXXXXXXXXXXXX runRequire");
		client.runRequire(file,opts);
	}
	this.ready = function(cb){
		if(client){
			sys.puts("running ready immediately");
			cb(client);
		} else {
			sys.puts("cueing ready");
			onReady.push(cb);
		}
	}
	this.start = function (done){
		client = null
		start(6060);
      this.server = DNode({hello
		start_child();
		this.ready(function(){
			done();
		});
		
	}
	this.end = function (){
		cp.kill();
		server.end();		
	}
}
module.exports = function MetaTest(port){

   return new MetaTestServer(server);
//	return new MetaTestServer(port);
}


