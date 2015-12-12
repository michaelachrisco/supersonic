'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseReducer = exports.application = exports.router = exports.Supersonic = undefined;

var _base_reducer = require('./reducers/base_reducer');

var _base_reducer2 = _interopRequireDefault(_base_reducer);

var _router = require('./routing/router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Supersonic = exports.Supersonic = function Supersonic() {
  _classCallCheck(this, Supersonic);
};

Supersonic.Application = {};
Supersonic.Router = new _router2.default();
Supersonic.root = process.cwd();

var router = Supersonic.Router;
var application = Supersonic.Application;

exports.router = router;
exports.application = application;
exports.BaseReducer = _base_reducer2.default;