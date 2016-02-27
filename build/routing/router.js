'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('../ext/object');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = function () {
  function Router() {
    _classCallCheck(this, Router);

    this._routes = { childRoutes: [] };
  }

  _createClass(Router, [{
    key: 'root',
    value: function root(path, component) {
      var queries = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      this._routes.path = path;
      this._routes.component = component;
      if (component.queries) this._routes.queries = component.queries;
    }
  }, {
    key: 'route',
    value: function route(path, component, controller, queries, callback) {
      if (callback && callback.is_a('Function')) {
        var router = new Router();

        router.root(path, component, queries);
        callback(router);

        this._routes.childRoutes.push(router._routes);
      } else {
        var onEnter = function onEnter(nextState, replaceState) {
          if (controller.is_a('Function')) {
            var cont = new controller(nextState, replaceState);
            cont.call();
          }
        };

        var params = { path: path, onEnter: onEnter, component: component, queries: queries };
        this._routes.childRoutes.push(params);
      }
    }
  }]);

  return Router;
}();

exports.default = Router;