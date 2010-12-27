var mini = require('miniorm')
  , traverser = require('traverser/traverser2')
  , log = require('logger')
  , model = module.exports

module.exports = database ()
module.exports.db = database

function database (dir){
  var db = mini.db(dir)
    , model = {}
  model.Requires = db.model('Requires')
  model.Required = db.model('Required')
  model.Remaps = db.model('Remaps')
  model.Remapped = db.model('Remapped')

  model.Module = db.model('Module',
    { isTest: false
    , get requires () {
        return model.Requires.__collection.get(this.id)
      }
    , set requires (value) {
        return model.Requires.__collection.set(this.id,value)
      }
    , get required () {
        return model.Required.__collection.get(this.id)
      }
    , set required (value) {
        return model.Required.__collection.set(this.id,value)
      }
    , get remaps () {
        return model.Remaps.__collection.get(this.id)
      }
    , set remaps (value) {throw new Error ("set remaps with model.addRemaps()")}
    , get remapped () {
        return model.Remapped.__collection.get(this.id)
      }
    , set remapped (value) {throw new Error ("set remapped with model.addRemaps()")}
    /*
      getters/setters for remaps?
          
    */   
    })
  /*
    ???
  store remaps like this and then traverse them when looking for what tests to run?

  when there is a remap, that is an alias for a module.
  it means it can stand in place for another module.
  other modules can require it, via the remap.
  think of the remap as a no-change adapter.

  so when searching through the dependency tree, 
  if A can be remappedAs B, also update tests for B, with B->A
  (A can be remappedAs B, B remapsTo A)

  ... remaps may not necessarily go both ways ...

  the traversal splits sideways at a remap.
  and makes another list, attached to the specific remap.

  so, generate a set of lists of tests to rerun.
  defaults -> tests
     remap -> tests

  so if X is updated,
  and Y depends on X,
  and Y is remappedAs Y'
  then also run required of Y' with Y' -> Y (which implies X, a part of Y)

  (remembering to check for infinite loops Y' -> Y -> Y'

  i'm most confused about what way the remap relation goes. 

  X is remapped as Y = X can be used in place of Y
  A remaps to B = B can be used in place of A 
  {A: B} (remaps), B.remapped goes 

  A.remaps == [B]
  b.remapped == [A]

  hmm. when a test is updated, 
  it means you also need to retest it's dependency's remaps.
  so runTestList * remaps of updated module + it's dependencies.

  plus what it's dependants are remapped to.
  */

  model.Module.add = function (name,isTest){
    return new model.Module (
      { id: name
      , isTest: (isTest || false) 
      , modified: new Date() } ).save()
  }
  model.addRemaps = function (remaps){
    Object.keys(remaps).forEach(function (from){
      var to = remaps[from]
      if(!model.Module.get(to))
        model.Module.add(to)
      if(!model.Module.get(from))
        model.Module.add(from)

      model.Remaps.set(from,
        merge(model.Remaps.get(from), [to] ) )
      model.Remapped.set(to,
        merge(model.Remapped.get(to), [from] ) )
    })    
  }
  model.dependencyTree = function(tree){
    var requires = {}
      , required = {}
    //process the dependency tree.
    //add new Modules
    // set thier requires/required fields.
    traverser(tree, {branch: branch})

    function branch(p){
      if(p.key){
        var childs = Object.keys(p.value)
        requires[p.key] = merge(requires[p.key],childs)
        childs.forEach(function (e){
          required[e] = merge(required[e],[p.key])
        })
      }
      p.each()
    }

    for (var i in requires) {
      if(!model.Module.get(i)){
        model.Module.add(i)
      }

    //update, don't overwrite
    model.Requires.__collection.set (i
      , merge (model.Requires.__collection.get(i)
        , requires[i] ) )
    }

    for(var i in required){
      if(!model.Module.get(i)){
        model.Module.add(i)
      }

    //update, don't overwrite
    model.Required.__collection
      .set (i, merge(model.Required.__collection.get(i), required[i]))
    }
  }
  
  function merge(x,y){
    x = x || []
    y.forEach(function (e){
      if(-1 == x.indexOf(e))
        x.push(e)
    })
    return x
  }

  function addIf(array,item){
    if(-1 == array.indexOf(item))
      array.push(item)
  }

  model.testsToRun = testsToRun
  function makeRemaps(from,to){
    var remaps = {}
    remaps.from = to
    return remaps 
  }
  function makeSet(remaps){
    return {remaps: remaps, tests: []}
  }
  function testsToRun (updated) {
  /*
  add dependants of updated to a list until got everything
  I can't use traverser for this yet, because I have to generate the tree.
  build a few examples like this, then add generators into traverser.

  for each in updated,
    merge required into a list.
    for each in that list, merge required into a list.
    unless it's a test, then add it to list of tests.
    when there is nothing more to add, return tests.
  */
    var defaults = makeSet({})
      , sets = [defaults]
    getUpdated(updated,defaults)
    return sets;
    
    function getUpdated(up,set){
      var n = []
      up.forEach(function (e){

        var m = model.Module.get(e)
        if(!m)
          throw new Error('expected a Module:' + e)
        if(m.isTest){
          addIf(set.tests,e)
          return
        }
        var r = m.required
        n = merge(n,r)
      } )
      if(n.length)
        getUpdated(n,set)
    }
  }
  return model
}
/*
  1. get tests to run:
    add modules,
    get tests.

  2. add requires/required for each module
  
  3.  on update,
      find list of tests which must be run.    
*/

