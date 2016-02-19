'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (keys, actions) {
  return function (component) {
    return (0, _reactRedux.connect)(function (state) {
      if ((typeof keys === 'undefined' ? 'undefined' : _typeof(keys)) === 'object') {
        var _ret = function () {
          var map = {};
          keys.forEach(function (key) {
            return map[key] = state[key];
          });
          return {
            v: map
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      } else {
        return _defineProperty({}, keys, state[keys]);
      }
    }, function (dispatch) {
      return (0, _redux.bindActionCreators)(_extends({}, actions), dispatch);
    })(component);
  };
};