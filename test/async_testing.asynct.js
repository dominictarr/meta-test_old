var child = require('meta-test/child3')
  , inspect = require('inspect')
  , Tester = require('meta-test/tester')
  , subtree = require('meta-test/subtree')
  , TestReports = require('meta-test/test_reports')
  , expected = require('meta-test/test/lib/asynct/expected2')

expected.forEach(makeTests)

function makeTests(expect){

  exports["asynct_adapter(" + expect.suite + ")"] = 
    function (test){
      console.log("test:" + expect.suite)

      child.runFile(expect.filename,{adapter: "meta-test/asynct_adapter", onSuiteDone: done})
      
      function done(status,report){
        test.notEqual(status,"loadError","\"" + report.stderr + "\"")//fix this
      
        subtree.assert_subtree(expect,report)
        status.should.eql(expect.status)
        report.should.have.property('filename')

        test.finish()
      }
    }
}


