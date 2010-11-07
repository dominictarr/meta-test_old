var async_testing = require('async_testing')
  , inspect = require('util').inspect
  , assert = require('assert')
  , tests = {
    test1: function(test){
      test.ok(true);
      test.finish();
    }
  }
  
  async_testing.runSuite(tests,{
    onSuiteDone: function(status,report){
      console.log('status: ' + status)
      console.log(inspect(report,false,5))
      assert.equal(status,'complete')
      assert.equal(typeof report,'object')
    }
  })
