var asynct = require('async_testing/lib/testing')
  , TestReports = require('meta-test/test_reports')
  , inspect = require('inspect')
  , se = require('style/error')  
  , style = require('style')  

exports.runTest = runTest

function runTest (file,callbacks){

  var r = new TestReports (file)
    , name = r.suite
    , newCallbacks = 
      { onTestStart: testStart
      , onTestDone:  testDone
      , onSuiteDone: suiteDone }

  process.on('exit', onExit)
  test = require(file)
  suiteStart()
  asynct.runSuite (test,newCallbacks)

  function callback(call,arg1,arg2){
    callbacks[call] && callbacks[call] (arg1,arg2)
  }

  function suiteStart (){
    callback('onSuiteStart',r.suiteStart())
  }

  function testStart (name){
    callback('onTestStart',name,r.testStart(name))
  }
  function testDone (status,report){
    if (report.failure)
      r.error (report.name,report.failure)
    try{
    var td = r.testDone (report.name)
    }catch (err){
      log('' + style("ERROR WHEN TRYING TO FINISH TEST REPORT - " + report.name).bold.yellow)
      log(se.styleError(err))
     throw err 
    
    }

    callback ('onTestDone',td.status,td)
  }
  function suiteDone (status,report){
    var td = r.suiteDone (report.test)
    callback ('onSuiteDone',td.status,td)
  }
  function onExit (code,status){
    callback ('onExit',code,status)
  }
}

if (require.main == module){
  runTest('meta-test/test/examples/asynct/test-wrap_tests',require('./cli').callbacks)
}
  
