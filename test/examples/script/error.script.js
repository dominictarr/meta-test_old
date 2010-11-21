
//require('assert').ok(false, "INTENSIONAL FAIL")

if(require.main == module){
  //exports.runTest = function (file,callbacks){
  inspect = require('inspect')
  require('meta_test/tester').runTest(__filename,
    { onSuiteDone: function (s,r){
        console.log(s,inspect(r))
        }})
}

throw new Error ("INTENSIONAL ERROR")


