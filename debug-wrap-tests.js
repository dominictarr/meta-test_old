var TestReports = require('meta_test/test_reports')
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
  r.testNames = [] //Object.keys(test)
  suiteStart()
  require('async_testing').runSuite (test,newCallbacks)

  function callback(call,arg1,arg2){
    callbacks[call] && callbacks[call] (arg1,arg2)
  }

  function suiteStart (){
    console.log("SUITE START")
    callback('onSuiteStart',r.suiteStart())
  }

  function testStart (name){
    console.log('' + style("TEST START -- " + name).bold.yellow)
    r.testNames.push(name)
    try{var t = r.testStart(name)} catch (err) {

      console.log("ERROR:" , err.stack)
      throw new Error("asdfsdg")
    
    }
    //thwory! should is makeing an error with no stack trace
    //new theory. when there is an error inbetween tests, runSuite will exit without printing.
    //havn't managed to confirm this... fixed it though.
    console.log('' + style(inspect(r.tests)).bold.yellow)
    callback('onTestStart',name,t)
  }
  function testDone (status,report){
    if (report.failure)
      r.error (report.name,report.failure)
    try{
    var td = r.testDone (report.name)
    }catch (err){
      console.log('' + style("ERROR WHEN TRYING TO FINISH TEST REPORT - " + report.name).bold.yellow)
      console.log(se.styleError(err))
     throw err 
    
    }
    console.log("TEST DONE444")

    callback ('onTestDone',td.status,td)
  }
  function suiteDone (status,report){
    console.log("SUITE DONE")
    console.log(inspect(report))
    var td = r.suiteDone (report.test)
    callback ('onSuiteDone',td.status,td)
  }
  function onExit (code,status){
    callback ('onExit',code,status)
  }
}

if (require.main == module){
  runTest('meta_test/test/examples/asynct/test-wrap_tests',require('./cli').callbacks)
}

