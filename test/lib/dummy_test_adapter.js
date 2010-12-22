

exports.runTest = runTest
console.log("1231111111111111^*&&&&&&&&&&&&&&&&&&&&&%^%&")
function runTest(file,callbacks){
  var test = require(file)
console.log("1231111111111111^*&&&&&&&&&&&&&&&&&&&&&%^%&")
/*
  if(callbacks.onSuiteStart){
    callbacks.onSuiteStart('onSuiteStart', {test: "dummy_test_adapter: onSuiteStart", object: test})
  }
  process.nextTick(c)
  function c (){*/
    if(callbacks.onTestStart){
      callbacks.onTestStart('onTestStart', {test: "dummy_test_adapter: onTestStart", object: test})
    }
    process.nextTick(c)
    function c (){
        console.log("DUMMY TEST ADAPTER: call onTestDone")
      if(callbacks.onTestDone){
        callbacks.onTestDone('onTestDone', {test: "dummy_test_adapter: onTestDone", object: test})
      }
      process.nextTick(c)
      function c (){
        console.log("DUMMY TEST ADAPTER: call onSuiteDone")
        if(callbacks.onSuiteDone){
          callbacks.onSuiteDone('onSuiteDone', {test: "dummy_test_adapter: onSuiteDone", object: test})
        }
        //ah. the test adapter shouldn't handle onExit. that should be for child process runner.
/*        process.nextTick(c)
        function c (){
          console.log("DUMMY TEST ADAPTER: call onExit")
          if(callbacks.onExit){
            callbacks.onExit('onExit',  {test: "dummy_test_adapter: onExit", object: test})//to mark a normal exit.
          }
        }*/
      }
    }
  //}
}
