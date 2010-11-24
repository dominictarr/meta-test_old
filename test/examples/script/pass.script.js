

if(require.main == module){
  //exports.runTest = function (file,callbacks){
  inspect = require('inspect')
  require('meta-test/tester').runTest(__filename,
    { onSuiteDone: function (s,r){
        console.log(s,inspect(r))
        }})
}

process.nextTick(c)
function c(){
//  throw "SFLASKJD"
  console.log('passing test')
  console.log()
}

