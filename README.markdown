MetaTest
========

a testing framework for testing testing frameworks.

used to check that a testing framework generates the correct result to running a known tests.

wraps testing frameworks with a standard reporting structure, an adapter and runs the test in a seperate process.

IMPORTANT NOTE TO SELF: *IN JavaScript
+ *ANYTHING* can be thrown. even null or undefined. must be able to handle this.
+ in an async enviroment, it is possible to get multiple errors.


###adapters: 

1.  script    :'meta-test/tester'           //plain scripts which throw an error or not.
2.  asynct    :'meta-test/asynct_adapter'   //async_testing
3.  expresso  :'meta-test/expresso_adapter' // expresso

###todo:
+ nodeunit
+ vows

commands:
  meta-test add [test module]
resolve that file & add to db, 
record modified time.
set last test time = 0
  meta-test replace [old module] with [new module] 
resolve modules, and create subsitution record.
  meta-test run {--all} 
run all tests which have a file modified since last test.
this means if the test has been modified, and also if a dependency has been modified.

1. first run
before a test is run the fist time, 
it's depends are unknown and it's lastTestTime is 0
so it gets added to testRunList to run.

2. after a change.
for depends, go through list of modules, 
check if they have been modified, 
search thier dependants for tests, and add to testRunList

what if there is a replacement?

3. with replacement.
test run list will need {test: {old1:new1, etc}}
how is the plularity of versions and replacements integrated into the testRunList?

store a test with remaps as another module... 
then check if anything is changed rerun that test.
  - no... will just bloat the tests list.
  - go through the list of replacements, check for changes, search original module's depentants for tests and add to test run list, with remaps.
  
  test run item:
  { test: module
  , hasRun: boolean
  , remaps: {} } 
  
  lists:
  modules
  remaps
  requires
  required
  trials //results 
  toTrial  //not yet run.
  
I want to test this without actually running a test. 
it should have an api, then a shim between the test adapter and the 

1. start with a list of modules.
2. run each test:
    record dependencies,
  
    the interface: the after a run, getting the dependency tree.
   
3. watch all the files in the list.
    interface: update call with a list of modules.
   
4. generate run list from dependencies of updated modules.
    interface: updates, remaps, dependency tree list ->  testRunList, with remaps.

model.
  //new Module({name:name,isTest: true}).save() ?
  addModule(name,isTest)
  module(name)//get data for module
  addRequires(requiresTree) // stores requies
  requires(module)
  required(module)
  remaps // just a list

  Module
    .isTest
    .modified
    .requires
    .required
  Remap

  //NEXT

  meta-test init //create .meta-test database here.
  //no, thats appropiate in git. 
  //maybe useful here, but more complicated.
  //just stick the data in ~/.meta-test
  meta-test add project/test
  meta-test update [all|test|module]
    //run all tests for updated module.
    //this is the command line interface, but I am also designing the API.
    //so this command line parsing thing, it's actually the same problem
    //as routing in a web framework

  routing is harder than adding remaps right now, 
  which would be easy from the start i have here
  but i'll just do it now while it's fresh.

