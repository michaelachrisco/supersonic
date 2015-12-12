'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouteBuilder = (function () {
  function RouteBuilder(context) {
    _classCallCheck(this, RouteBuilder);

    this.context = context;
  }

  _createClass(RouteBuilder, [{
    key: 'build',
    value: function build(path, component, callback) {
      this.context.childRoutes = this.context.childRoutes || [];
      this.context.childRoutes.push({ path: path, component: component });

      if (callback && callback.constructor.name === 'Function') {
        var index = this.context.childRoutes.length - 1,
            context = this.context.childRoutes[index],
            children = callback(new RouteBuilder(context));

        this.context.childRoutes = children;
      }

      return this.context;
    }
  }]);

  return RouteBuilder;
})();

exports.default = RouteBuilder;