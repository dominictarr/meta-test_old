//child3

var child = require('child')

/*
this has been replimented, this is adapter for interface of meta-test/child
*/

exports.runFile = runFile

function runFile (file,options) {

  var adapter = options.adapter
  delete options.adapter

  child.run(
    { require: adapter || 'async_testing/lib/asynct_adapter'
    , function: 'runTest'
    , args: [file, options] 
    , onError: error })
    
    function error (error){
      options.onSuiteDone && options.onSuiteDone('loadError',{error: error})
    }
    
}
