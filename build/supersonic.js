'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseModel = exports.BaseMigration = exports.reduxConnector = exports.relayContainer = exports.application = exports.router = exports.Supersonic = undefined;

var _router = require('./routing/router');

var _router2 = _interopRequireDefault(_router);

var _relay_decorator = require('./helpers/relay_decorator');

var _relay_decorator2 = _interopRequireDefault(_relay_decorator);

var _redux_decorator = require('./helpers/redux_decorator');

var _redux_decorator2 = _interopRequireDefault(_redux_decorator);

var _base_migration = require('./model/base_migration');

var _base_migration2 = _interopRequireDefault(_base_migration);

var _base_model = require('./model/base_model');

var _base_model2 = _interopRequireDefault(_base_model);

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
exports.relayContainer = _relay_decorator2.default;
exports.reduxConnector = _redux_decorator2.default;
exports.BaseMigration = _base_migration2.default;
exports.BaseModel = _base_model2.default;