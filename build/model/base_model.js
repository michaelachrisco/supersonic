'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _squel = require('squel');

var _squel2 = _interopRequireDefault(_squel);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _graphql = require('graphql');

var g = _interopRequireWildcard(_graphql);

var _graphqlRelay = require('graphql-relay');

var r = _interopRequireWildcard(_graphqlRelay);

var _relation = require('./relation');

var _relation2 = _interopRequireDefault(_relation);

var _database_adapter = require('./database_adapter');

var _database_adapter2 = _interopRequireDefault(_database_adapter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseModel = function () {
  _createClass(BaseModel, null, [{
    key: 'create',
    value: function create(params) {
      var pg = _squel2.default.useFlavour('postgres');
      var tableName = this.name.underscore().pluralize;

      var query = pg.insert().into(tableName).setFields(params).returning('*').toParam();

      return BaseModel.transaction(query).then(function (rows) {
        return rows[0];
      });
    }
  }, {
    key: 'relation',
    value: function relation(name) {
      return new _relation2.default(eval(name));
    }
  }, {
    key: 'first',
    value: function first() {
      return BaseModel.relation(this).first();
    }
  }, {
    key: 'find',
    value: function find(id) {
      return BaseModel.relation(this).find(id);
    }
  }, {
    key: 'where',
    value: function where(params) {
      return BaseModel.relation(this).where(params);
    }
  }, {
    key: 'transaction',
    value: function transaction(query) {
      var dbConfig = JSON.parse(_fs2.default.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development'];
      var adapter = new _database_adapter2.default(dbConfig);
      return adapter.runQuery(query);
    }
  }, {
    key: 'getGraphQLType',
    value: function getGraphQLType(type) {
      switch (true) {
        case /datetime/.test(type):
          return 'g.GraphQLString';
        case /string/.test(type):
          return 'g.GraphQLString';
        case /integer/.test(type):
          return 'g.GraphQLInt';
        case /float/.test(type):
          return 'g.GraphQLFloat';
        case /boolean/.test(type):
          return 'g.GraphQLBoolean';
        case /id/.test(type):
          return 'r.globalIdField()';
        default:
          return 'g.GraphQLString';
      }
    }
  }, {
    key: 'buildGraphQLType',
    value: function buildGraphQLType(columns, name) {
      var structure = {
        name: name.singularize().capitalize(),
        fields: {
          id: { type: 'g.GraphQLID' },
          created_at: { type: 'g.GraphQLString' },
          updated_at: { type: 'g.GraphQLString' }
        }
      };

      columns.forEach(function (column) {
        var name = column.split(":")[0];
        var type = column.split(":")[1];
        structure.fields[name] = { type: BaseModel.getGraphQLType(type) };
      });

      return structure;
    }
  }]);

  function BaseModel(attributes) {
    _classCallCheck(this, BaseModel);

    for (var key in attributes) {
      this[key] = attributes[key];
    }
  }

  return BaseModel;
}();

exports.default = BaseModel;