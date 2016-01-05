'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (component) {
  return (0, _reactRelay.createContainer)(component, { fragments: component.fragments });
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isomorphicRelay = require('isomorphic-relay');

var _isomorphicRelay2 = _interopRequireDefault(_isomorphicRelay);

var _reactRelay = require('react-relay');

var _reactRelay2 = _interopRequireDefault(_reactRelay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }