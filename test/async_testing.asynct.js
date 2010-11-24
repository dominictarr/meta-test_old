var child = require('meta-test/child2')
  , inspect = require('inspect')
  , Tester = require('meta-test/tester')
  , subtree = require('meta-test/subtree')
  , TestReports = require('meta-test/test_reports')
  , expected = require('meta-test/test/lib/asynct/expected2')

expected.forEach(makeTests)

/*makeTests(expected[0])
makeTests(expected[1])
makeTests(expected[2])
makeTests(expected[3])
makeTests(expected[4])*/
/*makeTests(expected[5])
makeTests(expected[6])
makeTests(expected[7])*/
//makeTests(expected[8])
//makeTests(expected[0])

function makeTests(expect){

  exports["asynct_adapter(" + expect.suite + ")"] = 
    function (test){
      console.log("test:" + expect.suite)

      child.runFile(expect.filename,{adapter: "meta-test/asynct_adapter", onSuiteDone: done})
      
      function done(status,report){
        test.notEqual(status,"loadError","\"" + report.stderr + "\"")//fix this
      
        console.log("TEST DONE")

        subtree.assert_subtree(expect,report)
        status.should.eql(expect.status)
        test.finish()
      }
    }

//  console.log(expect)
}


