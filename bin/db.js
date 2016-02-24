var pg = require('pg');
var fs = require('fs');
var DatabaseAdapter = require('../core/model/database_adapter').default

exports.migrate = function(args) {
  var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development']
  var adapter = new DatabaseAdapter(dbConfig);
  adapter.performMigrations()
}

exports.setup = function(args) {
  var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development']
  var adapter = new DatabaseAdapter(dbConfig)
  adapter.createDatabase(dbConfig.database)
}
