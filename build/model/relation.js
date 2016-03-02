'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _squel = require('squel');

var _squel2 = _interopRequireDefault(_squel);

var _database_adapter = require('./database_adapter');

var _database_adapter2 = _interopRequireDefault(_database_adapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Relation = function () {
  function Relation(klass) {
    var relation = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, Relation);

    this.klass = klass;
    this.klassName = klass.name;
    this.tableName = klass.name.underscore().pluralize;
    this.pg = _squel2.default.useFlavour('postgres');
    this.relation = relation || _squel2.default.useFlavour('postgres');
    if (!(process.env.NODE_ENV === 'test')) {
      var dbConfig = JSON.parse(_fs2.default.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development'];
      this.adapter = new _database_adapter2.default(dbConfig);
    }
  }

  _createClass(Relation, [{
    key: 'baseSelect',
    value: function baseSelect() {
      if (this.relation.constructor.name === 'Select') {
        return this.relation;
      } else {
        return this.relation.select().from(this.tableName);
      }
    }
  }, {
    key: 'buildWhereExpression',
    value: function buildWhereExpression(params) {
      var expressions = [];

      for (var key in params) {
        if (typeof params[key] === 'string') {
          expressions.push(key + ' = \'' + params[key] + '\'');
        } else {
          expressions.push(key + ' = ' + params[key]);
        }
      }

      var expr = _squel2.default.expr().and(expressions[0]);

      for (var i = 1; i < expressions.length; i++) {
        expr = expr.and(expressions[i]);
      }

      return expr.toString();
    }
  }, {
    key: 'all',
    value: function all() {
      return new Relation(this.klass, this.baseSelect()).execute();
    }
  }, {
    key: 'first',
    value: function first() {
      return new Relation(this.klass, this.baseSelect().limit(1)).execute();
    }
  }, {
    key: 'find',
    value: function find(id) {
      return new Relation(this.klass, this.baseSelect().where('id = \'' + id + '\'').limit(1)).execute().then(function (rows) {
        return rows ? rows[0] : null;
      });
    }
  }, {
    key: 'where',
    value: function where(params) {
      return new Relation(this.klass, this.baseSelect().where(this.buildWhereExpression(params)));
    }
  }, {
    key: 'toParam',
    value: function toParam() {
      return this.relation.toParam();
    }
  }, {
    key: 'execute',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var results;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.adapter.runQuery(this.toParam());

              case 3:
                results = _context.sent;

                this.results = results.map(function (row) {
                  return new _this.klass(row);
                });
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](0);

                console.error(_context.t0);

              case 10:
                _context.prev = 10;
                return _context.abrupt('return', this.results);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7, 10, 13]]);
      }));

      return function execute() {
        return ref.apply(this, arguments);
      };
    }()
  }, {
    key: 'results',
    get: function get() {
      return this._results;
    },
    set: function set(items) {
      this._results = items;
    }
  }]);

  return Relation;
}();

exports.default = Relation;