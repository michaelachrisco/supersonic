// Determines if the type of the object is what you ask it.
//
// var x = function() { return 1 }
// x.is_a('Function')
// -> true
//
if (!Object.is_a) {
  Object.defineProperty(Object.prototype, 'is_a', {
    value: function(type) {
      return this.constructor.name === type;
    }
  })
}

// Iterates over an object and yields a key and value to the function
//
// var obj = { a: 1, b: 2 }
// obj.each((key, value) => {
//   console.log(key, value)
// })
// -> a, 1
//    b, 2
Object.defineProperty(Object.prototype, 'each', {
  value: function(callback) {
    if (this.constructor.name === 'Array') {
      return this.forEach
    }

    var object = this

    for (let key of Object.keys(object)) {
      callback(key, object[key])
    }
  }
})
