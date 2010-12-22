
module.exports = parse
var WITH = 'with'
  , REPLACE = 'replace'
function parse (array){
  var out = []
  function g(array){
    var it = array.shift()
      , r
      , w
    if(array[0] == REPLACE){
        array.shift()
        r = array.shift()
        w = array.shift()
      if(w == WITH)
        w = array.shift()
      
      var a = {}
        , b = {}
        a[it] = b
        b[r] = w  
      out.push(a)
    } else out.push(it)
    if(array.length)
      g(array)
  }
  g(array)

  return out
}
