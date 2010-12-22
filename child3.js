//child3

var child = require ('child/child_stdout2')
  , log = require ('logger')
/*
this has been replimented, this is adapter for interface of meta-test/child
*/

exports.runFile = runFile

function runFile (file,options) {

  var adapter = options.adapter
  delete options.adapter

  child.run(
    { require: adapter || 'meta-test/asynct_adapter'
    , function: 'runTest'
    , args: [file, options] 
    //on exit, on timeout
    , onError: error 
    , onExit: options.onExit
    })
    
    function error (error){
      options.onSuiteDone && options.onSuiteDone('loadError',
        { filename: file 
        , error: error
        })
    }    
}
