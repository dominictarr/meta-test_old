var dir = "meta_test/test/examples/asynct/"
  , TestReports = require('meta_test/test_reports')
//  , fail = TestReports.assertObj
  , query = require('query')
  , inspect = require('inspect')
  , fail = {name: "AssertionError"}
  , error = {name: "Error"}
  , tests = 
[ { suite: 'test-all_passing'
  , tests: [
      ['test A']
    , ['test B']
    , ['test C']
    , ['test D']  ] }

,  { suite: 'test-async_assertions'
  , tests: [
      ['test success']
    , ['test fail',fail]
    , ['test success -- numAssertions expected']
    , ['test fail -- numAssertions expected',fail]
    , ['test fail - not enough -- numAssertions expected',fail]
    , ['test fail - too many -- numAssertions expected',fail] ] }

, { suite: 'test-custom_assertions'
  , tests: [
      ['test custom assertion pass']
    , ['test custom assertion fail',fail] ] }

, { suite: 'test-errors'
  , tests: [
      ['test sync error',error]
    , ['test async error',error] ] }
    
  , { suite: 'test-error_sync'
, tests: [
    ['test sync error',error] ] }
    
, { suite: 'test-error_async'
  , tests: [
      ['test passes']
    , ['test async error 1',error] 
    , ['test async error 2',error] 
    , ['test async error 3',error] ] }
    
, { suite: 'test-sync_assertions'
  , tests: [
      ['test success']
    , ['test fail',fail]
    , ['test success -- numAssertions expected']
    , ['test fail -- numAssertions expected',fail]
    , ['test fail - not enough -- numAssertions expected',fail]
    , ['test fail - too many -- numAssertions expected',fail] ] }
    
, { suite: 'test-uncaught_exception_handlers'
  , tests: [
      ['test catch sync error']
    , ['test catch async error'] 
    , ['test sync error fail',fail] 
    , ['test async error fail',fail]
    , ['test sync error async fail',fail]
    , ['test async error async fail',fail] ] }
    
, { suite: 'test-wrap_tests'
  , tests: [
      ['sync wrap → test',error]
    , ['async setup → test',error]
    , ['async teardown → test',error] ] } ]
module.exports = tests.map(testify)

//generate the test reports from this formula.

function testify(t,n){
  var r = new TestReports(dir + t.suite)
    t.tests.forEach(function (e){
      err = ('object' == typeof e[1]) ? {name: e[1].name} : e[1]
      r.test(e[0],err)
    })
  return r.suiteDone()
}

