var dir = "meta-test/test/examples/expresso/"
  , TestReports = require('meta-test/test_reports')
//  , fail = TestReports.assertObj
  , query = require('query')
  , inspect = require('inspect')
  , fail = {name: "AssertionError"}
  , error = {name: "Error"}
  , tests = 
    [ { suite: 'pass.expresso'
      , tests: [
          ['pass'] ] } 
    , { suite: 'fail.expresso'
      , tests: [
          ['fail',fail] ] } 
    , { suite: 'error.expresso'
      , tests: [
          ['error',error] ] } 
    , { suite: 'all.expresso'
      , tests: [
          ['pass']
        , ['fail',fail]  
        , ['error',error] ] } ]


//generate the test reports from this formula.

function testify(t,n){
  var r = new TestReports(dir + t.suite)
    t.tests.forEach(function (e){
      err = ('object' == typeof e[1]) ? {name: e[1].name} : e[1]
      r.test(e[0],err)
    })
  return r.suiteDone()
}

module.exports = tests.map(testify)

