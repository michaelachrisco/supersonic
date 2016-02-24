'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n      CREATE TABLE IF NOT EXISTS schema_migrations (\n        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n        migration_name character varying(255),\n        created_at timestamp DEFAULT current_timestamp\n      )\n    '], ['\n      CREATE TABLE IF NOT EXISTS schema_migrations (\n        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n        migration_name character varying(255),\n        created_at timestamp DEFAULT current_timestamp\n      )\n    ']),
    _templateObject2 = _taggedTemplateLiteral(['\n        ', '\n        ', '\n        ', '\n        ', '\n\n      '], ['\n        ', '\n        ', '\n        ', '\n        ', '\n\n      ']);

var _pgThen = require('pg-then');

var _pgThen2 = _interopRequireDefault(_pgThen);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _strings = require('../utils/strings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DatabaseAdapter = function () {
  function DatabaseAdapter(connParams) {
    _classCallCheck(this, DatabaseAdapter);

    this.connParams = connParams;
    this.connString = 'postgres://' + connParams.user + ':' + connParams.password + '@' + connParams.host + ':' + connParams.port + '/' + connParams.database;
  }

  _createClass(DatabaseAdapter, [{
    key: 'client',
    value: function client() {
      var connString = arguments.length <= 0 || arguments[0] === undefined ? this.connString : arguments[0];

      return _pgThen2.default.Client(connString);
    }
  }, {
    key: 'runQuery',
    value: function runQuery(query) {
      var connString = arguments.length <= 1 || arguments[1] === undefined ? this.connString : arguments[1];

      var client = this.client(connString);

      return client.query(query).then(function (res) {
        client.end();
        return res.rows;
      }).catch(function (ex) {
        client.end();
        console.error(ex.message);
      });
    }
  }, {
    key: 'createDatabase',
    value: function createDatabase(name) {
      var _this = this;

      var connParams = this.connParams;
      var connString = 'postgres://' + connParams.user + ':' + connParams.password + '@' + connParams.host + ':' + connParams.port;
      var query = 'CREATE DATABASE "' + name.underscore() + '";';

      return this.runQuery(query, connString).then(function (rows) {
        console.info('Database ' + name + ' created');
        _this.enableUUIDExtension();
      });
    }
  }, {
    key: 'enableUUIDExtension',
    value: function enableUUIDExtension() {
      var query = 'CREATE EXTENSION IF NOT EXISTS pgcrypto;';

      return this.runQuery(query).then(function (rows) {
        console.info('pgcrypto extension created');
      });
    }
  }, {
    key: 'createMigrationSchema',
    value: function createMigrationSchema() {
      var query = (0, _strings.heredoc)(_templateObject);
      return this.runQuery(query);
    }
  }, {
    key: 'getPerformedMigrations',
    value: function getPerformedMigrations() {
      var query = 'SELECT migration_name FROM schema_migrations';

      return this.runQuery(query);
    }
  }, {
    key: 'performMigration',
    value: function performMigration(migration) {
      var _this2 = this;

      var mig = require(process.cwd() + '/db/migrate/' + migration).default;
      var queryString = new mig().change();

      return this.runQuery(queryString).then(function (rows) {
        var lineLength = queryString.split("\n").reduce(function (a, b) {
          return a.length > b.length ? a : b;
        }).length;
        var lineString = Array(lineLength + 3).join("=");

        console.info((0, _strings.heredoc)(_templateObject2, migration, lineString, queryString, lineString));
        _this2.createMigrationRecord(migration.replace(/\.js/, ''));
      });
    }
  }, {
    key: 'createMigrationRecord',
    value: function createMigrationRecord(name) {
      var query = 'INSERT INTO schema_migrations (migration_name) VALUES(\'' + name + '\');';

      return this.runQuery(query);
    }
  }, {
    key: 'performMigrations',
    value: function performMigrations() {
      var _this3 = this;

      var files = _fs2.default.readdirSync(process.cwd() + '/db/migrate/');

      this.createMigrationSchema().then(function (res) {
        _this3.getPerformedMigrations().then(function (rows) {
          var completedMigrations = rows.map(function (row) {
            return row.migration_name;
          });
          var migrationsToPerform = [];

          files.forEach(function (file) {
            if (!completedMigrations.include(file.replace(/\.js/, ''))) migrationsToPerform.push(file);
          });

          migrationsToPerform.forEach(function (migration) {
            return _this3.performMigration(migration);
          });
        });
      });
    }
  }, {
    key: 'pool',
    get: function get() {
      return _pgThen2.default.Pool(this.connString);
    },
    set: function set(connString) {
      this.pool = _pgThen2.default.Pool(connString);
    }
  }]);

  return DatabaseAdapter;
}();

exports.default = DatabaseAdapter;