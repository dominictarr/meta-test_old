//cli

/*var argv = require('optimist')
      .usage('Usage: meta-test -a [script|asynct|expresso|vows] -t [test]')
      .demand(['a','t'])
      .argv*/

//var argv = {b: false, a: 'asynct'}
var style = require("style")
  , errors = require("style/error")
  , child = require('./child2')
  , log = require('logger')
  , curry = require('curry')
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
  exports.runAll = runAll

  function runAll(files,adapter){
    var results = []  

    loop(null)

    function loop(status,report){
      if(status)
        results.push([status,report])
      var test = files.shift()
        , a = /.(\w+)\.js$/.exec(test)
        
      _adapter = a ? a[1] : adapter

      if(test)
        run(require.resolve(test),_adapter,loop)
      else {
        finished()
      }
    }
    function finished(){
     console.log('\n')
     console.log(style('ALL TESTS COMPLETE').bold.white.to_s)
     console.log(Date(), '\n')

     results.forEach(function (e){
        suiteDone.apply(null,e)
      })
    }
  }

  function run (test,adapter,done){
   var opts = exports.callbacks
    , result = []
    opts.adapter = adapters[adapter]
    //oldDone = opts.onSuiteDone
    opts.onSuiteDone = function (status,report) {
     // oldDone(status,report)
     // done(status,report)
     result[0] = status
     result[1] = report
     suiteDone(status,report)
    }
    opts.onExit = curry(result,done)
    child.runFile ( test,  opts)
  }
 
  var colours = 
    { success : ["green"]
    , failure : ['yellow']
    , error :   ['red','bold'] 
    , started: ['yellow','bold']
    , loadError: ['yellow','bold','inverse']
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
    
    return status
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
    var styler = status(stat).styler
      , passes = 0
      , s = ''

    tests = report.tests || []
    tests.forEach(function (t){
      if(t.status == 'success') {
        passes ++
        return 
      }
      
      var message = t.failure ? '\n' + errors.styleError(t.failure) : ''
      s += 
        [ '\n'
        , status(t.status)
        , ' -- ' 
        , style(t.test).bold
        , '\n'
        , message
        ].join(" ")
    })
    var shortName = report.filename.replace(process.ENV.PWD,'.')
      , h = 
        style(styler(shortName) + ' ').rpad(55,'.') 
      + style(passes + '/' + tests.length).lpad(7,'.')
//    console.log(h)
  /*
  treat loadError like a normal error!

  */
   if(report.error){
      s += '\n' + errors.styleError(report.error)
    } else if (stat === 'loadError') {
      s += '\n' + errors.styleError(report.error)
    }

    console.log(h + s)
  }
