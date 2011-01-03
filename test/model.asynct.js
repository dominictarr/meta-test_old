//model.asynct.js
var _model = require('meta-test/model')
  , describe = require('should').describe
  , log = require('logger')
  
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
function setIsTest(model,id) {
  var m = model.Module.get(id)
  m.isTest = true
  m.save()
}
exports ['can add remaps'] = function (test) {
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
      ,  tests: ['meta-modular/examples/test/natural.random.asynct']}
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

/*
more through example.
use car metaphore.

remaps of dependencies:
all need to be substituted into tests, so they cartesian product all tests.

cartesian product? or every permutation?

this could generate a lot of tests to run, 
but there are also numerous ways to prioritise the tests.
also, compute is very cheap.

TESTS will have a lot of changing dependencies, so will need this for when tests update.

XXX when testing remapped modules, remaps need to be added to current remaps. XXX
*/
function shouldUpdate(model,module,expected){
  var actual = model.testsToRun([module])
  log('UPDATE', actual)

  describe(actual, "tests to run after " + module + " is updated")
    .should.eql(expected)
}
exports ['car metaphore example'] = function (test){
  var model = _model.db()
    , EM,IC, car,engine,spark,piston
    , carParts = 
  [ car = 
    { 'car': 
      engine = 
      { 'engine': 
        IC = 
        { 'piston': {}
        , 'crankshaft': {}
        , 'spark-plug': {} } }
    , 'brakes': {}
    , 'steering': {}
    , 'wheel': 
      { 'rubber-tyre': {} } }
  //TESTS.
  , { 'car-test'          : car }
  , { 'engine-test'       : engine }
  , { 'spark-test'        : { 'spark-plug': {} } }
  , { 'compression-test'  : { 'piston': {} } }
  //SUBSTITUTE PARTS
  , { 'spark-plug2': {}}
  , { 'electric-motor': 
      EM = 
      { 'magnets': {} 
      , 'commutator': {}
      , 'rotor': {} } }
  , { 'hybrid': 
      { 'electric-motor': EM
      , 'engine': IC } }
  , {'power-steering': 
      { 'hydraulics': {} } }
  ]

  var remaps = 
  [ /*{'engine'    : 'hybrid'} 
    // confusing, because this can produce infinite loop.
    // support this so can have wrapper modules.
    // check that modules are not circular when loading...
    // means will need hierachical remaps.
    // {'engine': {'.': 'hybrid', 'engine': 'engine'}}
    // load hybrid as default engine, but use normal engine inside hybrid. 
  ,*/ 
    {'engine'    : 'electric-motor'}
  , {'spark-plug': 'spark-plug2'}
  , {'steering'  : 'power-steering'} ]

  carParts.forEach(function(p){
    model.dependencyTree(p)
  })

  setIsTest(model,'car-test')
  setIsTest(model,'engine-test')
  setIsTest(model,'spark-test')
  setIsTest(model,'compression-test')

  model.Module.forEach(function(o,k){
    log("CAR EXAMPLE :",k, model.Module.get(k).required)
  })
  //test run list before adding remaps

  shouldUpdate ( model, 'spark-plug',
    [ {remaps: {}, tests: ['spark-test','engine-test','car-test'] } ] )

  shouldUpdate ( model, 'engine',
    [ {remaps: {}, tests: ['engine-test','car-test'] } ] )

  shouldUpdate ( model, 'steering',
    [ {remaps: {}, tests: ['car-test'] } ] )

/*
when a test is updated, gather remaps for requires (dependencies)
(remember: remaps & requires is moving up the dependency tree
           , remapped & required is moving down the tree)
.remaps is the essential remaps, these tests relation to the updated module.

submaps(?) for remaps of updated's requires?
must be a tree? incase the remaps have requires
or should it be an array, in that there are multiple options?
and each permutation needs to be tested.

these remaps apply to all tests in this run list

so, generate them with a different function! YUSS!

[{x:y}, {z:z2}, {a: {'.':A, b:b2, c:c2} } } ]
//or just generate the flat permutations?
1.  get list of remaps for requires of updated.

generate permutations,
for each permutation. get remapsOfRequires for each remap.    
*/
  remaps.forEach(function(p){
    model.addRemaps(p)
  })

  var emptyDefauts = {remaps: {}, tests: []}
  shouldUpdate ( model, 'spark-plug2',
    [ emptyDefauts //no tests for spark-plug2
    , {remaps: {'spark-plug': 'spark-plug2'}
      , tests: ['spark-test', 'engine-test', 'car-test'] } ] )

  shouldUpdate ( model, 'electric-motor',
    [ emptyDefauts //no tests for spark-plug2
    , {remaps: {'engine': 'electric-motor'}
      , tests: ['engine-test', 'car-test'] } ] )

//order of remaps is not important.

  describe(model.remapsOfRequires('spark-test')
    , "remaps of requires of spark-test")
    .should.eql([{'spark-plug':'spark-plug2'}])

  describe(model.remapsOfRequires('engine-test').sort()
    , "remaps of requires of spark-test")
    .should.eql(
      [ {'engine':'electric-motor'}//spark-plug wont be used if {engine:'electric-motor'}
      , {'spark-plug':'spark-plug2'} ].sort() )

  describe(model.remapsOfRequires('car-test').sort()
    , "remaps of requires of spark-test")
    .should.eql(
      [ {'engine':'electric-motor'}
      , {'spark-plug':'spark-plug2'} //spark-plug wont be used if {engine:'electric-motor'}
      , {'steering': 'power-steering'} ].sort() )
      
/*
this isn't quite right. spark-plug won't be used in an electric motor.

maybe generate permutations at each level, and append permutations of requires of each permutation?
car: [{en : e-m}, {sp:sp2}, {st: pow-st},{sp:sp2, st: pow-st}]
do I actually need to test every combination? is to test each single remap enough?

if so, what I have is enough.
maybe combinations are only REALLY important when one requires the other.

so, run tests for each set of remaps, and each map, get it's remapsOfRequries (recursively)
this example doesn't go that deep yet.  
*/

  /*
  So, next. run each set of tests from
  testsToRun with defaults and each remap in remapsOfRequires.
  
*/
  
  
  test.finish()
}


