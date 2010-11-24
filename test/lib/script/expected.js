
var dir = "meta_test/test/examples/script/"
  , TestReports = require('meta_test/test_reports')
  , fail = TestReports.assertObj
  , query = require('query')
  , inspect = require('inspect')
  , scripts =

//[filename             , error                   ]  
[ ["async_error.script" , new Error("Async Error")]
, ["error.script"       , new Error ("INTENSIONAL ERROR")]
, ["fail.script"        , fail.ok(false, "INTENSIONAL FAIL")]
, ["pass.script"                                  ]
, ["throw_string.script", "THROW STRING"          ] 
]

module.exports = scripts.map(testify)

function testify(t,n){
  //console.log(t)
  var r = new TestReports(dir + t[0])
//if(t[1]) 
//    delete t[1].stack
    err = ('object' == typeof t[1]) ? {name: t[1].name, message: t[1].message} : t[1]
  return r.test(r.suite,err).suiteDone()
  
}

/*query(module.exports).each(
  { tests: 
    { '.*' : 
      { failure: 
        function (e,k){
          delete e.stack
          } } } } )

this _is_ clever, but realized that i only need to chuck
  if(t[1]) 
    delete t[1].stack
into testify()
*/
