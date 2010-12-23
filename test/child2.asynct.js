if (module == require.main) {
  return require('async_testing').run(process.ARGV);
}

var child = require('meta-test/child2')
  , inspect = require('inspect')
  , log = require('logger')

/*
  this tests behaviour specific to meta-test/child2. 
  the extra stuff, messages, etc are seperated out in 'child'
*/


exports ['can run a simple test'] = function(test){

  child.runFile('meta-test/test/examples/asynct/test-all_passing',{onSuiteDone: suiteDone,onExit: test.finish})

  function suiteDone(status,report){
    test.equal(status,'success')
  }
}

exports ['can make callbacks into message and back'] = function(test){

  var message = 'asdfhasdflsdlf'
  var masterCallbacks = {
    send: function(m){
      test.equal(m,message)
      test.finish()
    }
  }

  mm = child.makeMessage(masterCallbacks)
  
  cb = child.makeCallbacks(mm,recieve)
  cb.send(message)
  function recieve(message){
    child.parseMessage(message,masterCallbacks)
  }
}

/*exports ['ignores noise'] = function(test){
    child.parseMessage(message,test.ifError)
}*/

exports ['accepts test adapter'] = function (test){
  var calls = ['onTestStart','onTestDone','onSuiteDone']
    , callbacks = { adapter: "meta-test/test/lib/dummy_test_adapter" }
    , called = []
  calls.forEach(each)
  
  function each(fName){
    callbacks[fName] = function (status,data){
      called.push(fName)
      console.log("dummy test adapter called: " + status + " expected:" + fName)
      test.equal(status,fName)
      test.deepEqual(data , {test: "dummy_test_adapter: " + fName, object: {magicNumber: 123471947194 } } )
      
    }
  }
    callbacks.onExit = function (){
    log("ON EXIT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    test.equal(calls.length,called.length,"expected " + inspect(called) + " to match:" + inspect(calls))
    test.finish()
  
  }

  child.runFile("meta-test/test/lib/magic_number" ,callbacks)
}


exports ['calls onSuiteDone(\'loadError\') if child did not exit properly.'
            + ' example: syntax error'] = function (test) {
            
  var callbacks = 
      { adapter: "meta-test/test/lib/dummy_test_adapter" 
      , onSuiteDone: done }
      
  function done(loadError,data){
    console.log(data)
    test.equal(loadError,'loadError')
    test.finish()
  }
            
  child.runFile("meta-test/test/examples/asynct/test-error_syntax" ,callbacks)
}

/*
exports ['calls onSuiteDone(\'loadError\') does not confuse stderr with real loadError.'] = function (test) {

  var callbacks = 
      { adapter: "meta-test/test/lib/dummy_test_adapter" 
      , onSuiteDone: done }
      
  function done(onSuiteDone,data){
    console.log(data)
    test.equal(onSuiteDone,'onSuiteDone')
    process.nextTick(test.finish)
  }

  child = require('async_testing/lib/child2')
  child.runFile("meta-test/test/lib/stderr" ,callbacks)
}

exports ['calls onSuiteDone(\'loadError\') does not confuse stderr with real loadError.2'] = function (test) {

  var callbacks = 
      { adapter: "meta-test/test/lib/dummy_test_adapter" 
      , onSuiteDone: done 
      , onError: error
      , onExit: error
      }
      function error(m){
        //should not be called.
        log("$$$$$$$$$$$$$$$$$$$$$$$$",m)
      }
      
  function done(onSuiteDone,data){
    console.log(data)
    test.equal(onSuiteDone,'onSuiteDone')
    process.nextTick(test.finish)
  }

  child.runFile("meta-test/test/lib/stderr" ,callbacks)
}

/**/
