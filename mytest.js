const assert = require('assert');
const myapp = require('../myapp');

describe('myfunc', () => {
  it('should return the sum of two numbers', () => {
    const result = myapp.myfunc(2, 3);
    assert.equal(result, 5);
  });

  it('should return NaN if either argument is not a number', () => {
    const result1 = myapp.myfunc('foo', 3);
    const result2 = myapp.myfunc(2, 'bar');
    assert.equal(isNaN(result1), true);
    assert.equal(isNaN(result2), true);
  });
});
