if (module == require.main) {
  return require('async_testing').run(process.ARGV);
}

//var child = require('meta-test/child2')
var child = require('meta-test/child3')
  , inspect = require('inspect')
  , log = require('logger')

exports ['can run a simple test'] = function(test){

  child.runFile('meta-test/test/examples/asynct/test-all_passing',{onSuiteDone: suiteDone})

  function suiteDone(status,report){
  console.log("ERROR:")
  console.log(inspect(report))
    test.equal(status,'success')
    
  //  tset.equal(report.test == 'complete')
    test.finish()
  }
}

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


function timeout(test,time){
  var _finish = test.finish
    , timer = setTimeout(function(){
        test.ok(false,"expected test to finish within " + time + ' milliseconds\n'
          + 'child process did not stop properly')
      },time)

  test.finish = function(){
    clearTimeout(timer)
    _finish.call(test) // call finish on test.
  }
}

exports ['calls onSuiteDone(\'loadError\') if child did not exit properly.'
            + ' example: syntax error'] = function (test) {
  timeout(test,2000)            
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
/**/

exports ['calls onSuiteDone(\'loadError\') does not confuse stderr with real loadError.'] = function (test) {

  var callbacks = 
      { adapter: "meta-test/test/lib/dummy_test_adapter" 
      , onSuiteDone: done }
      
  function done(onSuiteDone,data){
    console.log(data)
    test.equal(onSuiteDone,'onSuiteDone')
    process.nextTick(test.finish)
  }

  child.runFile("meta-test/test/lib/stderr" ,callbacks)
}


exports ['calls onSuiteDone(\'loadError\') does not confuse stderr with real loadError.2'] = function (test) {

  var callbacks = 
      { adapter: "meta-test/test/lib/dummy_test_adapter" 
      , onSuiteDone: done }
      
  function done(onSuiteDone,data){
    console.log(data)
    test.equal(onSuiteDone,'onSuiteDone')
    process.nextTick(test.finish)
  }

  child.runFile("meta-test/test/lib/stderr" ,callbacks)
}

/**/










