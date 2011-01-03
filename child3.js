//child3

var child = require ('child/child_stdout2')
  , log = require ('logger')
  , inspect = require('inspect')
  , render = require('render/render2')

/*
this has been replimented, this is adapter for interface of meta-test/child
*/

exports.runFile = runFile

function runFile (file,options, remap) {

  var adapter = options.adapter
  delete options.adapter

  child.run(
    { require: adapter || 'meta-test/asynct_adapter'
    , function: 'runTest'
    , args: [file, options] 
    //on exit, on timeout
    , remap: remap
    , remapReport: report
    , onError: error 
    , onExit: options.onExit
    })
    
    function error (error){
      options.onSuiteDone && options.onSuiteDone('loadError',
        { filename: file 
        , error: error
        })
    }    
    function report(r){

      function s (obj){
        return render(obj,{multi:true, pad: '\n '})
      }
      
      log(s(r.loaded[file]))
    }
}

function branches(depends){
var loaded = {}
  traverser(depends, {branch: branch})

  function branch(p){
    if(p.key != null){
      if(!loaded[p.key])
        loaded[p.key] = p.value
    }
    if(!p.reference)
      p.each()
  }
return loaded
}

