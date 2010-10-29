//context

//code 
var sys = require('sys')

console.log("hello");
oldProcess = process;
process = {platform:'sandbox'}
var s = "(function hello(){return 'hello from the inside ' + process.platform;})"
,  r = oldProcess.compile (s,'code.js')
console.log(r);
console.log(r.apply(null,[]))



console.log(sys.inspect(oldProcess))
console.log(sys.inspect(oldProcess.loop.toString()))
console.log(sys.inspect(oldProcess.binding('fs').read.toString()))


