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