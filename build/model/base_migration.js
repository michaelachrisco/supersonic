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
          sql = sql + ('\n  ' + key + ' ' + BaseMigration[value].pgType + ',');
        }
      });

      return sql + '\n  id integer NOT NULL\n);';
    }
  }]);

  return BaseMigration;
}();

BaseMigration.Str = _types.Str;
BaseMigration.Text = _types.Text;
BaseMigration.Bool = _types.Bool;
BaseMigration.Float = _types.Float;
BaseMigration.Integer = _types.Integer;
BaseMigration.DateTime = _types.DateTime;
exports.default = BaseMigration;