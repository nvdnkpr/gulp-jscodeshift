'use strict';
const fs = require('fs');

exports.jscodeshift = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  demo: function(test) {
    test.expect(1);

    const actual = fs.readFileSync('tmp/code.js','utf8');
    const expected = fs.readFileSync('tests/expected/code.js','utf8');
    test.equal(actual, expected, 'should transform the source file');

    test.done();
  }
};