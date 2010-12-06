//expresso-adapter


var old = require.extensions['']
  , fs = require('fs')
  , log = require('logger')  
  , TestReports = require('./test_reports')

if(!old)
  require.extensions[''] = function (){}
  
  var fn = require.resolve('expresso/bin/expresso')
  var expresso = fs.readFileSync(fn,'utf-8')
  
  require.extensions[''] = old
  

  expresso = expresso.replace ("defer;", "defer = true;")
  expresso = expresso.replace ("#!", "//#!")

exports.runTest = runTest
  
function runTest(file,callbacks){

  var testReport = new TestReports(file)
    , name = testReport.suite

  eval(expresso)
  
  function callback(call,arg1,arg2){
    callbacks[call] && callbacks[call] (arg1,arg2)
  }

  callback('onSuiteStart',testReport.suiteStart())

  
  print = function (){}
  var _error = error
  errored = {}
  error = function error (suite, test, err){
      errored[test] = err
      testReport.error(test,err)
      _error(suite, test, err)
    }  

  var _runSuite = runSuite

  var testNames = []
    , passed = []
    
  runSuite = function runSuite (suite,tests){
    testNames = Object.keys(tests)
    testNames.forEach(function (testName){
      callback('onTestStart',testName,testReport.testStart(testName))
    })
  

    _runSuite(suite,tests)
  }
  
  function testDone(name){
    var r = testReport.testDone(name)
    callback('onTestDone',r.status,r)
  }

  
  report = function report (){
    process.emit('beforeExit')//may throw more errors.

    testNames.forEach(function (testName){
    
      callback('onTestDone',testName,testReport.testDone(testName))

    })

    r = testReport.suiteDone()
    callback('onSuiteDone',r.status,r)
    callback('onExit')
  }
  
  process.on('exit',function (status,code){
    callback('onExit')

  })
  cwd = (file[0] == '/') ? '' : './'

  runFile(file + '.js')
  
  }
  

