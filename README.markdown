MetaTest
========

a testing framework for testing testing frameworks.

used to check that a testing framework generates the correct result to running a known tests.

wraps testing frameworks with a standard reporting structure, an adapter and runs the test in a seperate process.

IMPORTANT NOTE TO SELF: *IN JavaScript
+ *ANYTHING* can be thrown. even null or undefined. must be able to handle this.
+ in an async enviroment, it is possible to get multiple errors.


###adapters: 

1.script :'meta-test/tester'         //plain scripts which throw an error or not.
2.asynct :'meta-test/asynct_adapter' //async_testing

###todo:
+ expresso
+ nodeunit
+ vows

now that I have a lot of files, i gotta keep track of what ones are currently in a working state.
  -- thats meta-modular's job, amoungst other things.
  
  meta-modular is still using async_testing, not meta-test
  
  
  problem with meta test right now, is that since i'm bringing in child runner 
  (to run test in seperate process) it's not using remap ! 
  NEXT: integrate remap into child runner!
  
  test_meta_test broken.
  
  
