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
  
  test weakness:
  
  I have code for cuing up multiple jobs, but no test for that.

*/



var MetaTest = require('meta_test')
, subtree = require('meta_test/subtree')
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
  function suiteDone (status,report){
    console.log(":REPORT:");
    console.log(inspect(report,false,5));

    console.log(inspect(expected,false,5));
    
    test.doesNotThrow(function(){
      subtree.assert_subtree(expected,report)
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
  m.run(require.resolve('./.examples/test-one_pass'),{onSuiteDone: suiteDone});
  function suiteDone (status,report){
//    var exp = tests(t('pass','s'))
      var exp = 
        {tests:
          [{  name : 'pass'
            , numAssertions: 1
            }]
        }
    console.log('test one pass')
    console.log(inspect(report,false,5))
    
    subtree.assert_subtree(exp,report)
    test.ok(report.tests)
    test.equal(report.tests[0].name,'pass')
//    test.equal(report[0].tests[0].status,'success') //there is not currently a status property.
    test.equal(report.tests[0].numAssertions,1)
    
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
  m.run(require.resolve('./.examples/test-one_pass'),{onSuiteDone: suiteDone});
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
/*  var exp = tests(
      t('test pass','s')
    , t('test fail','f')
    , t('test error','e')
    )*/
    var exp = 
      { tests: 
        [ { name:'test pass'
          , numAssertions: 1
          }
        , { name:'test fail'
          , failure: {}
          }
        , { name:'test error'
          , error: {}
          }
        ]
      }

  checkTestSuite(test,2000,require.resolve('./.examples/test-example1'),exp)
}

exports['test not finishing test'] = function(test){
  var m = new MetaTest()
  , timeout = 2000
  , t_id = setTimeout(function(){
    m.stop()
    throw new Error("test timed out after " + timeout + " ms")
  },timeout)

  m.run(require.resolve('./.examples/test-not_finish'),{onSuiteDone: prematureExit});

  function prematureExit (status,unfinished){
    console.log("UNFINISHED:" + inspect(unfinished))
    var exp = {tests: ['not finished']}
    test.deepEqual(unfinished,exp,"expected: " + inspect(exp) + " but got: " + inspect(unfinished))
    //    m.stop();
    // somewhere in dnode there is something which breaks if you stop it twice.
    // gotta fix that
    clearTimeout(t_id)
    test.finish()
  }
}

exports['test hanging test'] = function (test){
  var m = new MetaTest()
  , time = 100
  , t_id = setTimeout(function(){
    m.stop()
    throw new Error("test timed out after " + timeout + " ms")
  },1000)

  m.run(require.resolve('./.examples/test-hang'),{time: time, onTimeout: timeout});
  
  function timeout (tests){
    clearTimeout(t_id);
    m.stop()
    test.finish();    
  }
}

