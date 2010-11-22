var path = require ('path')
  , assert = require('assert')
  , TestReports = require('./test_reports')

function Tester (filename){
  var dirname = path.dirname(filename)
  this.run = run

  function run(callbacks){
    var report = new TestReports(filename)
      , errored = false
      , name = report.suite

    process.on("uncaughtException",onError)
    process.on('exit',onExit)

    report.testNames = [name]

    function callback(call,arg1,arg2){
      callbacks[call] && callbacks[call] (arg1,arg2)
    }

    callback('onSuiteStart',report.suiteStart())
    callback('onTestStart',name,report.testStart(name))

    function testDone(){
      var r = report.testDone(name)
      callback('onTestDone',r.status,r)
    }

    function onError (error){
      errored = true
      report.error(name,error)
      testDone()
    }
    
    function onExit(code,status){
      try{
        if(!errored)
          testDone()
        r = report.suiteDone()

        callback('onSuiteDone',r.status,r)
        callback('onExit',code,status)
      } catch (error){
        console.error(error.toString())
      }
    }

    try{
      require(filename)
    } catch (error) { //catch sync error
      return onError(error)
    }
  }
}

exports = module.exports = Tester
module.exports.errorType = errorType

exports.runTest = function (file,callbacks){

  new Tester(file).run(callbacks)
}

function errorType(error){
  if('object' == typeof error){
    return error.name || error.constructor.name
  } else {
    return typeof error
  }
}


/*
  OKAY, so I've spend all day making error messages look nice, and colourful.
  next: eat, then make command line runner for meta-test ...
  
  

*/


