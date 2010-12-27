//model.asynct.js
var _model = require('meta-test/model')
  , describe = require('should').describe

function shouldModule (m){
  var it = describe(m,"A Module record")
  it.should.have.property('id').a('string')
}
var REF0,REF1,REF2
var trees = {
  natural: 
    {'meta-modular/examples/test/natural.asynct': 
      {'meta-modular/examples/natural': {} } }
, naturalR:
    {'meta-modular/examples/test/natural.random.asynct': 
      {'meta-modular/examples/natural2': {} } }
      //natural2 remaps to natural. 
, trees:
    {'traverser/test/trees.expresso':
      { 'traverser/trees': 
        { 'traverser/traverser2': 
          { 'inspect': REF0 = 
            { 'style/style': {} }
          , 'logger': REF1 = 
            { 'style/error': 
              {'style': REF0 }
            , 'style': REF0
            , 'inspect': REF0 }
          , 'curry': REF2 = 
            { 'curry/curry': {}}
          , 'traverser/iterators': 
            { 'logger': REF1
            , 'curry': REF2 } } }
      , 'inspect': REF0 } }
, curry:
    { 'curry/test/curry.expresso': 
      { 'curry':  
        { 'curry/curry': {} } } }
}

exports['can add Modules'] = function (test){
  var model = _model.db()
//  var depends = 
  var natT = model.Module.add('meta-modular/examples/test/natural.asynct',true)

  model.dependencyTree(trees.natural)

  natT = model.Module.get(natT.id)
  shouldModule(natT)

  var rq = model.Requires.get('meta-modular/examples/test/natural.asynct')

  describe(rq,"requires of " + natT.id)
    .should.eql(['meta-modular/examples/natural'])

  describe(natT.requires,"requires of " + natT.id)
    .should.eql(['meta-modular/examples/natural'])

  var nat = model.Module.get('meta-modular/examples/natural')
  shouldModule(nat)
  
  describe(nat.required,"required of " + nat.id)
    .should.eql([natT.id])
  
  test.finish()  
}
function setIsTest(model,id){
  var m = model.Module.get(id)
  m.isTest = true
  m.save()
}
exports ['can add remaps'] = function (test){
  var model = _model.db()
  model.dependencyTree(trees.natural)
  model.dependencyTree(trees.naturalR)

  //now, natural2 also passes natural.asynct, so include that 
  //natural.remapped = ['meta-modular/examples/natural2']

  model.addRemaps({'meta-modular/examples/natural': 'meta-modular/examples/natural2'})
 
  var natural = model.Module.get('meta-modular/examples/natural')
  var natural2 = model.Module.get('meta-modular/examples/natural2')

  describe(natural.remaps,"remaps of natural")
    .should.eql(['meta-modular/examples/natural2'])
  describe(natural2.remapped,"remapped of natural2")
    .should.eql(['meta-modular/examples/natural'])

  setIsTest(model,'meta-modular/examples/test/natural.asynct')
  setIsTest(model,'meta-modular/examples/test/natural.random.asynct')

  /*
  Now, if natural2 is updated, 
  test list should be 
  */
  var expected = 
    [ { remaps: {}
      ,  tests: ['meta-modular/examples/test/natural.random.asynct']}, //defaults
    , { remaps: {'meta-modular/examples/natural': 'meta-modular/examples/natural2'}
      ,  tests: ['meta-modular/examples/test/natural.asynct'] } ]

  describe ( model.testsToRun (['meta-modular/examples/natural2'])
    , "tests to rerun after updating traverser/iterators" )
      .should.eql (expected)
   
  test.finish()
}

exports ['adds modules & dependencies, more complex'] = function (test){
  var model = _model.db()

  model.dependencyTree(trees.trees)

  var modules = []
  
  model.Module.forEach(function (x){
    shouldModule(x)
    modules.push(x.id)
  })

  describe(modules,"all modules").should
    .eql( [ 'traverser/test/trees.expresso'
          , 'traverser/trees'
          , 'traverser/traverser2'
          , 'inspect'
          , 'style/style'
          , 'logger'
          , 'style/error'
          , 'style'
          , 'curry'
          , 'curry/curry'
          , 'traverser/iterators' ] )
          
  describe( model.Module.get('traverser/traverser2').requires
    , "requires for " + 'traverser/traverser2' ).should
    .eql( [ 'inspect'
          , 'logger'
          , 'curry'
          , 'traverser/iterators' ] )

 //1. check a few requires/required
  describe(model.Module.get('traverser/traverser2').required
    , "modules that require " + 'traverser/traverser2' ).should
    .eql( [ 'traverser/trees' ] )
 //2. add tree for another test.
 
  model.dependencyTree(trees.curry)

  describe( model.Module.get('curry').required
    , "modules which require " + 'curry')
    .should
    .eql( [ 'traverser/traverser2'
          , 'traverser/iterators'
          , 'curry/test/curry.expresso' ] )

  setIsTest(model,'curry/test/curry.expresso')
  setIsTest(model,'traverser/test/trees.expresso')

  //3. update some modules, and check that the correct tests are called to be rerun.
  //no, cos I don't know how i'll be recording tests yet.

  //just make a function to get the dependantTests on a module.  
 
  describe ( model.testsToRun (['traverser/iterators'])
  , "tests to rerun after updating traverser/iterators" )
    .should.eql ([{remaps:{}, tests:['traverser/test/trees.expresso']}])
  
  describe (model.testsToRun(['curry'])
  , "tests to rerun after updating curry - order is important")
    .should
    .eql( [ { remaps:{}
            , tests: ['curry/test/curry.expresso'
              , 'traverser/test/trees.expresso' ] } ] )
 
  //say, X has changed, what tests need to be rerun.
 
  test.finish()
}

