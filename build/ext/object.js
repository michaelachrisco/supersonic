'use strict';

// Determines if the type of the object is what you ask it.
//
// var x = function() { return 1 }
// x.is_a('Function')
// -> true
//
if (!Object.is_a) {
  Object.defineProperty(Object.prototype, 'is_a', {
    value: function value(type) {
      return this.constructor.name === type;
    }
  });
}

// Iterates over an object and yields a key and value to the function
//
// var obj = { a: 1, b: 2 }
// obj.each((key, value) => {
//   console.log(key, value)
// })
// -> a, 1
//    b, 2
if (!Object.each) {
  Object.defineProperty(Object.prototype, 'each', {
    value: function value(callback) {
      if (this.constructor.name === 'Array') {
        return this.forEach;
      }

      var object = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(object)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          callback(key, object[key]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  });
}