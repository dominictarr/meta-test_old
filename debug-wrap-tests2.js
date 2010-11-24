if (require.main == module){
  require('async_testing').runSuite(require('meta-test/test/examples/asynct/test-wrap_tests'),
    { onTestStart: function (){throw new Error("INVISIBLE!")}
    , onSuiteDone: function (status){console.log("suite is :", status)}
  
  })
}

