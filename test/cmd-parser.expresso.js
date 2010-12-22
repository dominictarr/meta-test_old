
var parser = require ('meta-test/cmd-parser')
  , describe = require('should').describe

exports ['parses list of file names to itself.'] = function (test){
    
  describe(parser(['a','b','c']),"parsed filename array")
    .should.eql(['a','b','c'])
}
exports ['parses ... replace ... with into object.'] = function (test){
  var r = 'replace'
    , w = 'with'

  describe(parser(['a',r,'b',w,'c']),"parsed filename array")
    .should.eql([{'a':{'b':'c'}}])

}
exports ['mix complex and simple. '] = function (test){
  var r = 'replace'
    , w = 'with'

  describe(parser(['X','a',r,'b',w,'c','Y']),"parsed filename array")
    .should.eql(['X',{'a':{'b':'c'}},'Y'])
    
}
