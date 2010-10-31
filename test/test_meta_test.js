//test-meta-test

if (module == require.main) {
  require('async_testing').run(__filename, process.ARGV);
}
/*
  currently interface is a little too complicated.
  there are callbacks for test starting, ending, the suite ending, 
  the suite not finishing,
  
  but what I want is one callback which gives a report no matter how the test
  finishes.
  
  but, first i want to get a handle on async_testing: tests to check the 
  results of all of the async_testing tests...
*/



var MetaTest = require('../meta_test')
, subtree = require('../subtree')
, inspect = require('util').inspect
//new MetaTest()

exports['MetaTest() instanceof MetaTest'] = function (test){
  var m = MetaTest()
//  test.ok(m instanceof MetaTest)
  test.finish();
}

  function tests(){
    return { tests: arguments}

  }
  function t(name,status){
    return {
        name:name
      , status: st(status)
    }
    function st(status){
     var m = {
        s:'success'
      , e:'error'
      , f:'failure'
      }
      return m[status]
      
    }
  }

function checkTestSuite(test,timeout,filename,expected){
  var m = new MetaTest()
  , t_id
  m.run(filename,{onSuiteDone: suiteDone});
  function suiteDone (report){

    console.log(inspect(expected),false,5);
    
    test.doesNotThrow(function(){
      subtree.assert_subtree(expected,report[0])
      });

    test.finish()
    clearTimeout(t_id)
  }
  t_id = setTimeout(function(){
    m.stop()
    throw new Error("test timed out after " + timeout + " ms")
  },timeout)
  
}

exports['test one pass'] = function (test){
  var m = new MetaTest()
  , timeout = 3000
  , t_id
  m.run('./test/examples/test-one_pass',{onSuiteDone: suiteDone});
  function suiteDone (report){
    var exp = tests(t('pass','s'))

    subtree.assert_subtree(exp,report[0])
    test.ok(report[0].tests)
    test.equal(report[0].tests[0].name,'pass')
    test.equal(report[0].tests[0].status,'success')
    
    test.finish()
    clearTimeout(t_id)
  }
  t_id = setTimeout(function(){
    throw new Error("test timed out after " + timeout + " ms")
  },timeout)
}

exports['error in onSuiteDone'] = function (test){
  var m = new MetaTest()
  , timeout = 1000
  , t_id
  , suiteDoneError = new Error("onSuiteDone error (intensional)");
  m.run('./test/examples/test-one_pass',{onSuiteDone: suiteDone});
  function suiteDone (report){
    throw suiteDoneError
  }
  t_id = setTimeout(function(){
    m.stop()
    throw new Error("test timed out after " + timeout + " ms")
  },timeout)

  test.uncaughtExceptionHandler = function (error){
    test.equal(error,suiteDoneError)
    clearTimeout(t_id)
    test.finish()
  };
}

exports['test example1'] = function(test){
  var exp = tests(
      t('test pass','s')
    , t('test fail','f')
    , t('test error','e')
    )
  checkTestSuite(test,2000,'./test/examples/test-example1',exp)
}

exports['test not finishing test'] = function(test){
  var m = new MetaTest()
  , timeout = 2000
  , t_id = setTimeout(function(){
    m.stop()
    throw new Error("test timed out after " + timeout + " ms")
  },timeout)

  m.run('./test/examples/test-not_finish',{onPrematureExit: prematureExit});

  function prematureExit (unfinished){
    console.log("UNFINISHED:" + inspect(unfinished))
    var exp = ['not finished']
    test.deepEqual(unfinished[0],exp,"expected: " + inspect(exp) + " but got: " + inspect(unfinished[0]))
    //    m.stop();
    // somewhere in dnode there is something which breaks if you stop it twice.
    // gotta fix that
    clearTimeout(t_id)
    test.finish()
  }
}

exports['test hanging test'] = function (test){
  var m = new MetaTest()
  , timeout = 1000
  , t_id = setTimeout(function(){
    m.stop()
    throw new Error("test timed out after " + timeout + " ms")
  },timeout)

  m.run('./test/examples/test-hang',{onTimeout: timeout});
  
  function timeout (tests){
    clearTimeout(t_id);
    m.stop()
    test.finish();    
  }
}

