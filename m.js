/*

  meta-test add [test]
  meta-test remap module1 module2 [options]
  meta-test update module|all
  meta-test requires module1
  meta-test required module1
  meta-test remaps module1
  meta-test remaped module1
  meta-test modules
  meta-test tests
  meta-test passes --tests [...] --as [module]  //many tests
  meta-test passed module
  meta-test results test --modules [] (results of each run against test)
  meta-test trials module --tests [] (results of each test module was in)
  meta-test help command

*/

var db = require('meta-test/model').db() //('~/.meta-test')



var Router = require('commands/router')
  , log = require('logger')
  , rout = Router ({
      add: function(req){
        var added = [] 
        req.options.modules.forEach(function (e){
          added.push(db.Module.add(e,req.options.test))
          } ) 
        return added
      }
    , remap: dump
    , update: dump
    , modules: function (req){
      var modules = []
      db.Module.forEach(function (v,k){
        modules.push(k)
      })
      return modules
    }
    , tests: dump
}).args({add: [['modules']]}).decorate({call:function (req,returned){log(req,'\n\n  returned:',returned)}})

if(module == require.main){
  var term = require('commands/terminal')
  log("ARGV", process.argv)
  term.wrapper(rout,2).call({args: process.argv})
}


function dump (req){return req}

