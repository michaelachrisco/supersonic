'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../ext/object');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var controllers = require('require-all')({
  dirname: process.cwd() + '/build/app/controllers',
  filter: /(.+_controller)\.js$/,
  recursive: true
});

var queries = require('require-all')({
  dirname: process.cwd() + '/build/app/queries',
  filter: /(.+_query)\.js$/,
  recursive: true
});

var Router = (function () {
  function Router() {
    _classCallCheck(this, Router);

    console.log("FUCK IT");
    this._routes = { childRoutes: [] };
  }

  _createClass(Router, [{
    key: 'root',
    value: function root(path, component) {
      this._routes.path = path;
      this._routes.component = component;
    }
  }, {
    key: 'route',
    value: function route(path, component, callback) {
      if (callback && callback.is_a('Function')) {
        var router = new Router();

        router.root(path, component);
        callback(router);

        this._routes.childRoutes.push(router._routes);
      } else {
        var onEnter = function onEnter(nextState, replaceState) {
          var controllerName = controllers[path + '_controller'],
              controller = undefined;

          if (controllerName) {
            controller = eval('new ' + controllerName + '.default(nextState, replaceState)');
          } else {
            controller = new controllers.base_controller.default(nextState, replaceState);
          }

          controller.call();
        };

        var _queries = undefined,
            queryName = _queries[path + '_query'];

        if (queryName) _queries = queryName.default;

        this._routes.childRoutes.push({ path: path, component: component, onEnter: onEnter, queries: _queries });
      }
    }
  }]);

  return Router;
})();

exports.default = Router;