
var TestReports = require('meta_test/test_reports')
  , inspect = require('inspect')
  
  
exports.runTest = function (file,callbacks){
  var r = new TestReports (file)
    , name = r.suite
    , newCallbacks = 
      { onTestStart: testStart
      , onTestDone:  testDone
      , onSuiteDone: suiteDone }

  process.on('exit', onExit)
    
  test = require(file)
  r.testNames = Object.keys(test)
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
    console.log("TEST START -- " + name)
    callback('onTestStart',name,r.testStart(name))
  }
  function testDone (status,report){
    console.log("TEST DONE -- " + report.name)
    if (report.failure)
      r.error (report.name,report.failure)
    console.log("TEST DONE222: "+ inspect(report))
    try{
    var td = r.testDone (report.name)
    }catch (err){
    console.log("ERROR!")
    console.log(err)
    throw err 
    
    }
    console.log("TEST DONE444")

    callback ('onTestStart',td.status,td)
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
