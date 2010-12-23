//cli

/*var argv = require('optimist')
      .usage('Usage: meta-test -a [script|asynct|expresso|vows] -t [test]')
      .demand(['a','t'])
      .argv*/

//var argv = {b: false, a: 'asynct'}
var style = require("style")
  , errors = require("style/error")
  , child = require('./child3')
  , log = require('logger')
  , inspect = require('inspect')
  , curry = require('curry')
  , parser = require('meta-test/cmd-parser')
  , adapters = 
      { script: "meta-test/tester"
      , asynct: "meta-test/asynct_adapter" 
      , expresso: "meta-test/expresso-adapter" }

  exports.adapters = adapters

  exports.callbacks = {
     onSuiteStart: suiteStart
    , onTestDone: testDone
    , onTestStart: testStart
    , onSuiteDone: suiteDone }

  exports.run = run
  exports.runAll = runAll

  function runAll(filesToRun,adapter){
    var results = []  
    filesToRun = parser(filesToRun)
//    files = [files[0]]
    log(filesToRun)

   loop(null)

    function loop(result){
      if(result)
        results.push(result)
      var test = filesToRun.shift()
        , a = /.(\w+)\.js$/.exec(test)

      _adapter = a && adapters[a[1]] ? a[1] : adapter

      if(test)
        run(test,_adapter,loop)
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
      , remaps
    opts.adapter = adapters[adapter]

    if('object' == typeof test){
      var _test = test
      test = Object.keys(_test)[0]
      remaps = _test[test]
    }

    //oldDone = opts.onSuiteDone
    opts.onSuiteDone = function (status,report) {

     result[0] = [status, report, false, remaps]

     log('report',result.length)

    suiteDone(status, report, false, remaps)
    }
    opts.onExit = curry(result,done)
        
    child.runFile ( require.resolve(test), opts, remaps)
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

  function suiteDone (stat,report,quiet,remaps){
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
        , (quiet ? '' : message)
        ].join(" ")
    })

    var shortName = report.filename.replace(process.ENV.PWD,'.')
      , h 
      if(!remaps){
        h = 
          style(styler(shortName) + ' ').rpad(55,'.') 
        + style(passes + '/' + tests.length).lpad(7,'.')
      } else {
        h = 
          styler(shortName) + '\n'
        + style('  ' + styler(inspect(remaps)) + ' ').rpad(55,'.') 
        + style(passes + '/' + tests.length).lpad(7,'.')
      }
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

