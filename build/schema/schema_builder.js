'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SchemaBuilder = function () {
  function SchemaBuilder(queries) {
    var _this = this;

    _classCallCheck(this, SchemaBuilder);

    var files = _fs2.default.readdirSync(process.cwd() + '/build/app/models');
    this.models = {};
    files.forEach(function (file) {
      if (file.match(/\.js$/)) {
        var name = file.replace(/\.js/g, '').capitalize().singularize();
        _this.models[name] = require(process.cwd() + '/build/app/models/' + file).default;
      }
    });
    this.types = {};
    this.queries = queries;
  }

  _createClass(SchemaBuilder, [{
    key: 'getType',
    value: function getType(dataType) {
      switch (true) {
        case /timestamp/.test(dataType):
          return _graphql.GraphQLString;
        case /character/.test(dataType):
          return _graphql.GraphQLString;
        case /integer/.test(dataType):
          return _graphql.GraphQLInt;
        case /double/.test(dataType):
          return _graphql.GraphQLFloat;
        case /boolean/.test(dataType):
          return _graphql.GraphQLBoolean;
        case /uuid/.test(dataType):
          return _graphql.GraphQLID;
      }
    }
  }, {
    key: 'generateTypes',
    value: function generateTypes() {
      for (var name in this.models) {
        var columns = this.models[name].attributes;
        var fields = {};

        for (var columnName in columns) {
          console.log(columnName);
          fields[columnName] = {
            type: this.getType(column[columnName])
          };
        }

        this.types['' + name.underscore()] = new _graphql.GraphQLObjectType({
          name: name,
          fields: fields
        });
      }
      return true;
    }
  }, {
    key: 'schema',
    value: function schema() {
      var _this2 = this;

      this.generateTypes();
      var fields = {};

      var _loop = function _loop(type) {
        fields[type.underscore()] = {
          type: _this2.types[type],
          args: {
            id: { type: _graphql.GraphQLID }
          },
          resolve: function resolve(_, args) {
            return _this2.models[type.capitalize()].find(args.id);
          }
        };
      };

      for (var type in this.types) {
        _loop(type);
      }

      return new _graphql.GraphQLSchema({
        query: new _graphql.GraphQLObjectType({
          name: 'Query',
          fields: fields
        })
      });
    }
  }]);

  return SchemaBuilder;
}();

exports.default = SchemaBuilder;