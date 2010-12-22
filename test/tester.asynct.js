
var child = require('meta-test/child3')
  , inspect = require('inspect')
  , Tester = require('meta-test/tester')
  , subtree = require('meta-test/subtree')
  , TestReports = require('meta-test/test_reports')
  , expected = require('meta-test/test/lib/script/expected')
//tester.script.asynct.js

/*
  OKAY! 
  refactor this to run in a child process...
  
  i've altered child2 so that you call it with a test adapter.

  NEXT: try loading tester as an adapter for child2.
*/



expected.forEach(makeTests)

function makeTests(expect){

  exports[expect.suite] = 
    function (test){
      child.runFile(expect.filename,{adapter: "meta-test/tester", onSuiteDone: done})
      
      function done(status,report){
        test.notEqual(status,"loadError","\"" + report.stderr + "\"")//fix this
      
        subtree.assert_subtree(expect,report)
        status.should.eql(expect.status)

        test.finish()
      }
    }
}


exports ['can run an erroring test, async error'] = function (test){

/*
  to cleanly catch this sort of error, without interfering with THIS test frameworkm
  run this test in another process.
  
    -- or use a script test instead of an asynct test...
*/

  var cb = {adapter: "meta-test/tester", onSuiteDone: done}
    , name = 'async_error'
    , expectedStatus = 'error'
    , error = new Error("Async Error")
    
  var report = 
      new TestReports("meta-test/test/examples/script/async_error.script")
        .test('async_error',error).suiteDone()
     delete report.tests[0].failure.stack 
     //specific details of stack trace may be different.

  child.runFile('meta-test/test/examples/script/async_error.script',cb)

  function done (status,data){

    test.equal(status,expectedStatus, "expected '" + expectedStatus + "', got:" + status + "\n" + inspect(data))

    subtree.assert_subtree(report,data)

    test.finish()  
  }
}


