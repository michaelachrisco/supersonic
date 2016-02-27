#! /usr/bin/env babel-node

var pg = require('pg');
var fs = require('fs');
var DatabaseAdapter = require('../build/model/database_adapter').default

exports.migrate = function(args) {
  var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())
  var currentConfig = dbConfig[process.env.NODE_ENV || 'development']
  var testConfig = dbConfig.test

  // Migrate the current database
  var adapter = new DatabaseAdapter(currentConfig);
  adapter.performMigrations()

  // Migrate the test database if not in production
  if (!(process.env.NODE_ENV === 'production')) {
    var adapter = new DatabaseAdapter(testConfig)
    adapter.performMigrations()
  }
}

exports.setup = function(args) {
  var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())
  var currentConfig = dbConfig[process.env.NODE_ENV || 'development']
  var testConfig = dbConfig.test

  // Create the production or development database
  var adapter = new DatabaseAdapter(currentConfig)
  adapter.createDatabase(currentConfig.database)

  // Create the test database if not in production
  if (!(process.env.NODE_ENV === 'production')) {
    var adapter = new DatabaseAdapter(testConfig)
    adapter.createDatabase(testConfig.database)
  }
}

exports.reset = function(args) {
  var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())
  var currentConfig = dbConfig[process.env.NODE_ENV || 'development']
  var testConfig = dbConfig.test

  // Reset the production(eek) or development database
  var adapter = new DatabaseAdapter(currentConfig)
  adapter.resetDatabase(currentConfig.database)

  // Reset the test database if not in production
  if (!(process.env.NODE_ENV === 'production')) {
    var adapter = new DatabaseAdapter(testConfig)
    adapter.resetDatabase(testConfig.database)
  }
}
