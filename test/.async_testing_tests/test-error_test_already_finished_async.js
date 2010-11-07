if (module == require.main) {
  return require('../lib/async_testing').run(process.ARGV);
}

module.exports = {
  'test async already finished': function(test) {
    test.finish();
    process.nextTick(function() {
      test.finish();
    });
  },
  //if this is commented out, then the test does not testAlreadyFinished
  //because the childprocess is killed before test.finish is called again.
  //maybe not the ideal behaviour.
  'test another test': function(test) {
   // test.finish();
  }
}
