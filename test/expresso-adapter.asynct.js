var child = require('meta-test/child3')
  , inspect = require('inspect')
//  , Tester = require('meta-test/tester')
  , subtree = require('meta-test/subtree')
  , TestReports = require('meta-test/test_reports')
  , expected = require('meta-test/test/lib/expresso/expected')
  , describe = require('should').describe
  , adapter = require('meta-test/expresso-adapter')
  , log = require('logger')


//expected.forEach(makeTests)
//expected.forEach()
makeTests(expected[0])

function makeTests(expect){

  exports["expresso-adapter(" + expect.suite + ")"] = 
    function (test){
//      log("test:" + expect.suite)

      var opts = {adapter: "meta-test/expresso-adapter", onSuiteDone: done}
//      log(opts)
    
//      log(expect.filename)

    
      child.runFile(expect.filename,opts)
      
      function done(status,report){
//      log(status)
        
        test.notEqual(status,"loadError","loadError :\"" + report.error + "\"")//fix this
      
        if(expect.status != status){
          log(report)        
        }
      
        subtree.assert_subtree(expect,report)
        status.should.eql(expect.status)
        test.finish()
      }
    }
}

exports ['has runTest'] = function (test){
  var it = describe(adapter, "expresso-adapter")
  it.should.have.property('runTest').a('function')

  test.finish()
}
/**/
