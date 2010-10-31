var DNode = require('dnode')
, EventEmitter = require('events').EventEmitter
, inspect = require('util').inspect

//given a filename, loads it, and then runs it as an async test in another process, and then reports the result.

module.exports = MetaTest

MetaTest.prototype = EventEmitter.prototype;
function MetaTest(port){
  if(!(this instanceof MetaTest)) { return new MetaTest(port) }
  if(!port) {port = Math.floor(Math.random() * 40000 + 10000)}
  
  var self = this
  , onHandshake = []
  , runner = null
  , started = false
  , jobs = []
  
  /*
    I've arranged the functions so that if something only needs to be
    visible to one scope, then it is defined in that scope.

    and i've put named functions after returns so make to clearer...
  */
  
  self.run = function (filename,opts){

    if(!started){start()}
    addJob(filename,opts)

    function start(){
      started = true;
      
      self.server = startServer(port,isReady,startRunner)
      
      return self
            
      function isReady(remote){
        self.runner = remote
        doJob();
      }
      function startRunner (){
        self.child = require('./runner').start(port)
      }
      function startServer (port,handshake,ready){
        var server = DNode({handshake: handshake}).listen(port)
        server.on('ready',ready);

        server.on('localError',onError)
        server.on('remoteError',onError)
         
        /*
          named functions may be defined AFTER return...
        */

        return server 
        
        function onError(error){
          self.stop()

          old = error.message
          error.message = ("(intercepted by MetaTest):" + old);
          /*
          throw the error on the next tick, because otherwise DNode will grab it.
          but this is gaurenteed to break the test.
          */

          process.nextTick(function(){
            throw error
          });
         }
      }
    }


    function addJob (fn,opts){
      jobs.push([fn,opts])
    }

    function doJob (){
      var job = jobs.shift()

      wrapFinishFunc(job[1],'onSuiteDone')
      wrapFinishFunc(job[1],'onPrematureExit')
      self.runner.runRequire(job[0],job[1])

      return
      //modify this to check for timeout... 
      //which will be canceled when the process exists.
      function wrapFinishFunc(object,key){
        var f = object[key] 
        if('function' === typeof object[key]) {
          object[key] = function (){
            f.call(null,arguments)
            nextJob() 
            
            return
            
            function nextJob(){
              if(jobs.length > 0){
                doJob()
              } else {
                self.server.end()
              }
            }
          }
        }
      }
    }
  }//self.run

  self.stop = function (){
    self.child.kill()
    self.server.end();
  }
 
}
