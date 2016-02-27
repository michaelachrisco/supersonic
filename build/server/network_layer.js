'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactRelay = require('react-relay');

var _reactRelay2 = _interopRequireDefault(_reactRelay);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NetworkLayer = function () {
  function NetworkLayer() {
    var url = arguments.length <= 0 || arguments[0] === undefined ? '/queries' : arguments[0];

    _classCallCheck(this, NetworkLayer);

    this.url = url;
  }

  _createClass(NetworkLayer, [{
    key: 'buildRequest',
    value: function buildRequest(request) {
      return JSON.stringify({
        query: request.getQueryString(),
        variables: request.getVariables()
      });
    }
  }, {
    key: 'sendMutation',
    value: function sendMutation(request) {
      var _this = this;

      return (0, _isomorphicFetch2.default)(this.url, {
        method: 'POST',
        body: this.buildRequest(request),
        headers: this.defaultHeaders
      }).then(function (response) {
        return response.json();
      }).then(function (results) {
        if (results.errors) {
          request.reject(new Error(_this.formatRequestErrors(results.errors, request)));
        } else {
          request.resolve({ response: results.data });
        }
      });
    }
  }, {
    key: 'sendQueries',
    value: function sendQueries(requests) {
      var _this2 = this;

      return Promise.all(requests.map(function (request) {
        return (0, _isomorphicFetch2.default)(_this2.url, {
          method: 'POST',
          body: _this2.buildRequest(request),
          headers: _this2.defaultHeaders
        }).then(function (response) {
          return response.json();
        }).then(function (results) {
          if (results.errors) {
            request.reject(new Error(_this2.formatRequestErrors(results.errors, request)));
          } else {
            request.resolve({ response: results.data });
          }
        });
      }));
    }
  }, {
    key: 'supports',
    value: function supports(options) {
      return false;
    }
  }, {
    key: 'formatRequestErrors',
    value: function formatRequestErrors(errors, request) {
      var CONTEXT_BEFORE = 20,
          CONTEXT_LENGTH = 60,
          queryLines = request.getQueryString().split('\n');

      return errors.map(function (_ref, ii) {
        var locations = _ref.locations;
        var message = _ref.message;

        var prefix = ii + 1 + '. ';
        var indent = ' '.repeat(prefix.length);

        //custom errors thrown in graphql-server may not have locations
        var locationMessage = locations ? '\n' + locations.map(function (_ref2) {
          var column = _ref2.column;
          var line = _ref2.line;

          var queryLine = queryLines[line - 1];
          var offset = Math.min(column - 1, CONTEXT_BEFORE);
          return [queryLine.substr(column - 1 - offset, CONTEXT_LENGTH), ' '.repeat(offset) + '^^^'].map(function (messageLine) {
            return indent + messageLine;
          }).join('\n');
        }).join('\n') : '';

        return prefix + message + locationMessage;
      }).join('\n');
    }
  }, {
    key: 'defaultHeaders',
    get: function get() {
      return {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      };
    }
  }]);

  return NetworkLayer;
}();

exports.default = NetworkLayer;