//test runner
var   DNode = require('dnode')
,	spawn = require('child_process').spawn
,	asynct = require('async_testing')

   function Runner (){
      this.runRequire = function (file,opts){
         if (!opts){
            opts = {}
         }
         asynct.runSuite(require(file),opts)
      }   
   }

exports.connect = function (port){
   var runner = new Runner()
   r = DNode().connect(port,function (server){
      server.handshake(runner)
   });
   
   return r
}

exports.start = function (port){
//   process.exec('node', [_filename, port])
   
  	cp = spawn('node', [__filename, port])
	cp.stdout.on('data' , function(data){
			console.log('RUNNER: ' + data);
		}
	);

}

if (module == require.main) {
//   console.log('process.ARGV:' + process.ARGV);
   exports.connect(1 * process.ARGV[2]);
//  require('async_testing').run(__filename, process.ARGV);
}

