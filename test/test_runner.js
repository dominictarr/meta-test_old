//test-runner
/*
   start a DNode process on a given port, connect to a server and then call handshake.
*/
var sys = require('sys')
, inspect = require('sys').inspect
,  DNode = require('dnode')
,  runner = require('meta_test/runner')
,  subtree = require('meta_test/subtree');

function checklist (l,test){
	var list = l.concat()
	return function check(item){
		//call with no args to assert that check list should be finished.
		//if this fails it will make the test fail like an error rather than not finish.
		if (arguments.length === 0){
			test.equal(list.length,0,"expected check to be [] but was:" + list);
			
		} else {
			var index = list.indexOf(item)
			test.ok(index != -1, "expected that list :" + sys.inspect(list) + " included " + sys.inspect(item) )
			list.splice(index,1)
			if (list.length == 0){
        process.nextTick(function(){test.finish();});
			}
		}
	}
}
function mockServer (port,handshake,ready,test){
   var server = DNode({handshake: handshake}).listen(port)
   server.on('ready',ready);
   //server.removeAllListeners('error')//an error should break the test.
   server.on('error',function (err){
      throw err;
   });
   server.on('localError',onError)
   server.on('remoteError',onError)
   
   function onError(error){
      //throw new Error("caught unexpected error:" + error);   
      old = error.message
      test.doesNotThrow(function(){
        error.message = ("(intercepted by mockServer in meta-test/test/test-runner):" + old);
        throw error
      });
   }

   return server
}

function warnVersion (error) {
  var warn = "\n(this version of test-runner is only tested compatible with version 0.3.2 of async_testing)"
   if(error.message){
    error.message = error.message + warn
    throw error
   } else if('object' != typeof error) {
    throw "" + error + warn
   } else {
    error.message = warn
    throw error
   }
    
}

exports['test killable'] = function (test){
   var port = Math.floor(Math.random() * 40000 + 10000)
   ,  check = checklist(['handshake'],test)
   ,  server = mockServer(port,handshake,ready,test)
   ,  time
   ,  client

   function handshake (other){
         console.log('handshake');
         test.ok(other.runRequire)
        
         console.log('kill runner');
         client.kill()
//         clearTimeout(time)
         check('handshake');
   }

   function ready () {
         console.log('ready');
      client = runner.start(port) 
   }
   
   time = setTimeout(function(){
      console.log('timeout');
      server.end();
  //    check();
   },1000);
}

exports['test init'] = function (test){
   var port = Math.floor(Math.random() * 40000 + 10000)
   ,  check = checklist(['handshake'],test)
   ,  server = mockServer(port,handshake,ready,test)
   ,  client
   ,  time
   function handshake (other){
         console.log('handshake');
         test.ok(other.runRequire)
         check('handshake');
         clearTimeout(time)
   }

   function ready () {
         console.log('ready');
      client = runner.connect(port) 
   }
   
   time = setTimeout(function(){
      check()
      server.end();
   },1000);
}

exports['test start process'] = function (test){
   var port = Math.floor(Math.random() * 40000 + 10000)
   ,  check = checklist(['handshake remote'],test)
   ,  server = mockServer(port,handshake,ready,test)
   ,  client
   function handshake (other){
         console.log('handshake remote');
         check('handshake remote');
         test.ok(other.runRequire)
   }
   function ready () {
      console.log('ready');
      runner.start(port);
   }

   setTimeout(function(){
      //check()
      server.end();
   },1000);
}
/*exports['test start one pass'] = function (test){
   var port = Math.floor(Math.random() * 40000 + 10000)
   ,  check = checklist(['handshake remote','suiteDone'],test)
   ,  server = mockServer(port,handshake,ready)
   ,  client
   function handshake (other){
         console.log('handshake remote');
         check('handshake remote');
         test.ok(other.runRequire)
         other.runRequire('./test/examples/test-one_pass',{onSuiteDone: suiteDone})
         
         function suiteDone(report){
          console.log('SUITE DONE');
          console.log(report);
          var exp = 
            { tests: [ { name: 'pass', numAssertions: 1 } ],
            numFailures: 0,
            numSuccesses: 1 }

          check('suiteDone');
         }
   }
   function ready () {
      console.log('ready');
      runner.start(port);
   }

   setTimeout(function(){
      check()
      server.end();
   },1000);
}*/
function testATest(test,filename,timeout,checkResults){
   var port = Math.floor(Math.random() * 40000 + 10000)
   ,  check = checklist(['handshake remote','suiteDone'],test)
   ,  server = mockServer(port,handshake,ready,test)
   ,  client
   function handshake (other){
         console.log('handshake remote');
         check('handshake remote');
         test.ok(other.runRequire)
         other.runRequire(filename,{onSuiteDone: suiteDone})//change
         
         function suiteDone(status,report){
          console.log('SUITE DONE');
          console.log(report);
          checkResults(status,report)
          check('suiteDone');
          server.end()
          console.log('AFTER SERVER END');
          clearTimeout(time)
         }
         /*
         function errorDone(report){
          checkResults(report)
          check('suiteDone');
          server.end()
          
          console.log('ERROR - SUITE DONE');
          clearTimeout(time)
         }*/
   }
   function ready () {
      console.log('ready');
      runner.start(port);
   }

  var time = setTimeout(function(){
      check()
      server.end();
   },timeout);
}

exports['test start one pass'] = function (test){
  testATest(test,require.resolve('./.examples/test-one_pass'),2000,suiteDone)
  function suiteDone(results){
    console.log("DONE:" + inspect(results));
  }
}
exports['test start example1'] = function (test){
  testATest(test,require.resolve('./.examples/test-example1'),7000,suiteDone)
  function suiteDone (status,results){
    console.log("DONE:" + inspect(status));
    console.log("results:" + inspect(results));
//  throw new Error ("CATCH THIS");
  }
}

if (module == require.main) {
  require('async_testing').run(__filename, process.ARGV);
}

//exports['test init']()
