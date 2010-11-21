
var child = require('meta_test/child2')
  , inspect = require('inspect')
  , Tester = require('meta_test/tester')
  , subtree = require('meta_test/subtree')
  , TestReports = require('meta_test/test_reports')
  , expected = require('meta_test/test/lib/script/expected')
//tester.script.asynct.js

/*
  OKAY! 
  refactor this to run in a child process...
  
  i've altered child2 so that you call it with a test adapter.

  NEXT: try loading tester as an adapter for child2.
*/


/*
exports ['can accept a file and return tests for that file'] = function (test){

  t = new Tester ('./examples/pass.script')
  test.deepEqual(t.tests,['pass.script'])
  test.finish()
}
*/
  /*
    am i gonna have to run all tests as a seperate process?
    that may be the most comprehensive solution...
    
    or design this to run around the test in the seperate process?
     - to ensure reporting is correct?
     - so child 2 is passed the test, then calls this, which calls the test.
     - child2 just handles communicating results.
     - this is the adapter to the test framework, & handles making reports
  */  
//  test.finish()
/*
exports ['can run a test'] = function (test){

  t = new Tester ('async_testing/test/examples/pass.script')
  test.deepEqual(t.tests,['pass.script'])
  
  t.run('pass.script',done)
  
  function done (status,data){
    var expected = 
          { test:'pass.script'
          , status: 'success'
          }
    test.equal(status,'success', "expected success:\n" + inspect(data))
    subtree.assert_subtree(expected,data)
    test.finish()  
  }
}


exports ['can run a failing test'] = function (test){

  var t = new Tester ('async_testing/test/examples/fail.script')
    , name = 'fail.script'
  test.deepEqual(t.tests,[name])
  
  t.run(name,done)
  
  function done (status,data){
    var expected = 
          { test:name
          , status: 'failure'
          , failureType: 'AssertionError' //actual type of error. will be string if a string is thrown.
          , failure: {}
          }
    test.equal(status,'failure', "expected 'failure', got:" + status + "\n" + inspect(data))
    subtree.assert_subtree(expected,data)
    test.finish()  
  }
}


exports ['can run an erroring test'] = function (test){

  var t = new Tester ('async_testing/test/examples/error.script')
    , name = 'error.script'
    , expectedStatus = 'error'

  test.deepEqual(t.tests,[name])
  
  t.run(name,done)
  
  function done (status,data){
    var expected = 
          { test:name
          , status: expectedStatus
          , failureType: 'Error' //actual type of error. will be string if a string is thrown.
          , failure: {} }

    test.equal(status,expectedStatus, "expected '" + expectedStatus + "', got:" + status + "\n" + inspect(data))
    subtree.assert_subtree(expected,data)
    test.finish()  
  }
}

exports ['can run an erroring test, non error thrown'] = function (test){

  var t = new Tester ('async_testing/test/examples/throw_string.script')
    , name = 'throw_string.script'
    , expectedStatus = 'error'

  test.deepEqual(t.tests,[name])

  t.run(name,done)

  function done (status,data){
    var expected = 
          { test:name
          , status: expectedStatus
          , failureType: 'string' //actual type of error. will be string if a string is thrown.
          , failure: "INTENSIONAL STRING THROW"
          }
    test.equal(status,expectedStatus, "expected '" + expectedStatus + "', got:" + status + "\n" + inspect(data))
    subtree.assert_subtree(expected,data)
    test.finish()  
  }
}
*/

//exports = module.exports =  
expected.forEach(makeTests)

function makeTests(expect){

  exports[expect.suite] = 
    function (test){
      console.log("test:" + expect.suite)

      child.runFile(expect.filename,{adapter: "meta_test/tester", onSuiteDone: done})
      
      function done(status,report){
        test.notEqual(status,"loadError","\"" + report.stderr + "\"")//fix this
      
        subtree.assert_subtree(expect,report)
        status.should.eql(expect.status)

        test.finish()
      }
    }

  console.log(expect.suite)
  console.log(expect)
}


exports ['can run an erroring test, async error'] = function (test){

/*
  to cleanly catch this sort of error, without interfering with THIS test frameworkm
  run this test in another process.
  
    -- or use a script test instead of an asynct test...
*/

  var cb = {adapter: "meta_test/tester", onSuiteDone: done}
    , name = 'async_error'
    , expectedStatus = 'error'
    , error = new Error("Async Error")
    
  var report = 
      new TestReports("meta_test/test/examples/script/async_error.script")
        .test('async_error',error).suiteDone()
     delete report.tests[0].failure.stack 
     //specific details of stack trace may be different.

  child.runFile('meta_test/test/examples/script/async_error.script',cb)

  function done (status,data){

    test.equal(status,expectedStatus, "expected '" + expectedStatus + "', got:" + status + "\n" + inspect(data))
    //console.log("GOT:\n" + inspect(data))
    //console.log("WANT:\n" + inspect(report))

    subtree.assert_subtree(report,data)

    test.finish()  
  }
}


