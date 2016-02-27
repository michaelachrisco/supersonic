'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaMount = require('koa-mount');

var _koaMount2 = _interopRequireDefault(_koaMount);

var _koaGraphql = require('koa-graphql');

var _koaGraphql2 = _interopRequireDefault(_koaGraphql);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = require(process.cwd() + '/build/config/schema.js').default;

exports.default = function (app) {
  app.use((0, _koaConvert2.default)((0, _koaMount2.default)('/graphql', (0, _koaGraphql2.default)({ schema: schema }))));
  app.use(_database2.default);
};