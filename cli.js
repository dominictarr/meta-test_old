//cli

/*var argv = require('optimist')
      .usage('Usage: meta-test -a [script|asynct|expresso|vows] -t [test]')
      .demand(['a','t'])
      .argv*/

//var argv = {b: false, a: 'asynct'}
var style = require("style")
  , errors = require("style/error")
  , child = require('./child2')
  , adapters = 
      { script: "./tester"
      , asynct: "./asynct_adapter" 
      , expresso: "./expresso-adapter" }
//  , adapter = adapters[argv.a] || (function (){throw "require -a to be [script|asynct|expresso|vows]"})()

  exports.adapters = adapters

  exports.callbacks = {
     onSuiteStart: suiteStart
    , onTestDone: testDone
    , onTestStart: testStart
    , onSuiteDone: suiteDone }

  exports.run = run

  function run (test,adapter,done){
   var opts = exports.callbacks
    opts.adapter = adapters[adapter]
    oldDone = opts.onSuiteDone
/*    opts.onSuiteDone = function (status,report) {
      oldDone(status,report)
      done(status,report)
    }*/
    opts.onExit = done
   child.runFile ( test,  opts)
  }
 
  var colours = 
    { success : ["green",'bold']
    , failure : ['yellow','inverse']
    , error :   ['red','bold','underline'] 
    , started: ['yellow','bold']
    , loadError: ['yellow','bold','underline','inverse']
    }
  var suite =''

  function suiteStart(report){
    console.log(['        ~~~~~~~',style('MetaTest').bold,'~~~~~~~        '].join(' '))
    console.log(Date(), '\n')
    suite = report.suite
    var s = 
     [ style("SUITE:").white.bold
     , style(report.suite).cyan.bold
     , '\n    '
     , style(report.filename).grey
     , report.status 
     ,'\n'].join(' ')
     
    console.log(s)
  }

  function status (s){
    var _s = s
      if(s == 'error')
        s = s.toUpperCase()
      var status = style(s)
      status.styles = colours[_s] || ['rainbow']
    return '' + status
  }
  function testStart (status,report){

    var s = ['   *',style(report.test).cyan].join(' ')
    
    console.log(s)
  }
  function testDone (stat,report){

    var s = ['   -',style(report.test).grey.rpad(60,style('.').grey), status (report.status)].join(' ')

    console.log(s)
  }

  function suiteDone (stat,report){
    var s = [style("Suite Done!").white.bold, style(report.suite).bold.cyan, '\n\t', style(report.filename).grey,'\n'].join(' ')
    
      tests = report.tests || []
    var pass = 0

    s += tests.map(function (t){
      if(t.status == 'success') pass ++
      return ['   ',status(t.status), ' -- ' , style(t.test).bold].join(" ")
         + (t.failure ? '\n' + errors.styleError(t.failure) : ' -- ')
    }).join('\n')

  /*
  treat loadError like a normal error!

  */

   if(report.error){
      s += errors.styleError(report.error)
    } else if (stat === 'loadError') {
      s += '\n' + inspect(report)
    }

    s += '\n'
    s += ["RESULT:" , style(status(stat)).underline, style(pass + '/' + tests.length).bold.lpad(10)].join(' ')
    
    console.log(s)
  }
