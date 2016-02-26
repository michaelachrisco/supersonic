'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _types = require('./types');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseMigration = function () {
  function BaseMigration() {
    _classCallCheck(this, BaseMigration);
  }

  _createClass(BaseMigration, [{
    key: 'createTable',
    value: function createTable(structure) {
      var sql = 'CREATE TABLE ' + structure.tableName + ' (';
      structure.each(function (key, value) {
        if (key !== 'tableName') {
          sql = sql + ('\n  ' + key + ' ' + BaseMigration.typeMap[value].pgType + ',');
        }
      });
      sql = sql + '\n  created_at timestamp DEFAULT current_timestamp,';
      sql = sql + '\n  updated_at timestamp DEFAULT current_timestamp,';
      return sql + '\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid()\n);';
    }
  }]);

  return BaseMigration;
}();

BaseMigration.typeMap = {
  string: _types.Str,
  text: _types.Text,
  boolean: _types.Bool,
  float: _types.Float,
  integer: _types.Integer,
  datetime: _types.DateTime
};
exports.default = BaseMigration;