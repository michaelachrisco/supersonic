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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = require(process.cwd() + '/build/config/schema.js');

exports.default = function (ctx, next) {
  (0, _koaConvert2.default)((0, _koaMount2.default)('/graphql', (0, _koaGraphql2.default)({ schema: schema })));
};