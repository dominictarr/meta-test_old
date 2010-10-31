
exports['test success'] = function(test) {
  process.nextTick(function() {
      test.ok(true, 'This should be true');
      test.finish();
    });
};

exports['test fail'] = function(test) {
  process.nextTick(function() {
      test.ok(false, 'This should be false');
      test.finish();
    });
};

exports['test success -- numAssertionsExpected'] = function(test) {
  test.numAssertions = 1;
  process.nextTick(function() {
      test.ok(true, 'This should be true');
      test.finish();
    });
};

// test that the num assertions error doesn't override an assertion error
exports['test fail -- numAssertionsExpected'] = function(test) {
  test.numAssertions = 1;
  process.nextTick(function() {
      test.ok(false, 'This should be false');
      test.finish();
    });
};

exports['test fail - not enough -- numAssertionsExpected'] = function(test) {
  test.numAssertions = 1;
  process.nextTick(function() {
      test.finish();
    });
};

exports['test fail - too many -- numAssertionsExpected'] = function(test) {
  test.numAssertions = 1;
  process.nextTick(function() {
      test.ok(true, 'This should be true');
      test.ok(true, 'This should be true');
      test.finish();
    });
};

if (module == require.main) {
  require('../lib/async_testing').run(__filename, process.ARGV);
}
