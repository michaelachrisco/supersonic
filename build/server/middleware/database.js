'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['', ''], ['', '']);

var _pgThen = require('pg-then');

var _pgThen2 = _interopRequireDefault(_pgThen);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _database_adapter = require('../../model/database_adapter');

var _database_adapter2 = _interopRequireDefault(_database_adapter);

var _sqlTemplateStrings = require('sql-template-strings');

var _sqlTemplateStrings2 = _interopRequireDefault(_sqlTemplateStrings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
    var dbConfig, adapter, _ref, client, done;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dbConfig = JSON.parse(_fs2.default.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development'];
            adapter = new _database_adapter2.default(dbConfig);

            ctx.pg = ctx.pg || {};
            ctx.pg.sqlTemplate = function (sqlString) {
              var name = arguments.length <= 1 || arguments[1] === undefined ? 'query' : arguments[1];

              return Object.assign((0, _sqlTemplateStrings2.default)(_templateObject, sqlString), { name: name });
            };

            _context.next = 6;
            return adapter.pool();

          case 6:
            _ref = _context.sent;
            client = _ref.client;
            done = _ref.done;


            ctx.pg.connection = { client: client, done: done };

            _context.next = 12;
            return next();

          case 12:

            ctx.pg.connection.done();
            delete ctx.pg.connection;

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })),
      _this = undefined;

  return function (_x, _x2) {
    return ref.apply(_this, arguments);
  };
}();