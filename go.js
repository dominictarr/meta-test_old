var inspect = require('inspect')

process.argv.shift()
process.argv.shift()
var adapters = ['asynct','script','expresso','nodeunit','vows']

var adapter = 'asynct'
if (process.argv[0]) {
  if (-1 < adapters.indexOf (process.argv[0]) ) {
    adapter = process.argv.shift()
  } 
  
}
var files = [].concat(process.argv)

//console.log('adapter:', adapter)
//console.log('files:', inspect(files))
require.paths.push(process.env.PWD)
//console.log('paths:',inspect(require.paths))


var cli = require('./cli')

//console.log(files)
cli.runAll(files,adapter)

/*
run()

function run(){
  var test = files.shift()
    , a = /.(\w+)\.js$/.exec(test)
    
  _adapter = a ? a[1] : adapter

  console.log(a)
  
  console.log(test)
  if(test)
    cli.run(require.resolve(test),_adapter,run)
}
*/
/*
>meta add [projectdir|git-repo]
>meta update [author/]project[/file]
>meta init .

>mtest [look for ./test directory]
>mtest -adapter file 
*/


