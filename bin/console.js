var fs = require('fs')
var repl = require('./console/babel_node')
var BaseModel = require('../build/model/base_model').default
var DatabaseAdapter = require('../build/model/database_adapter').default

exports.run = function() {
  // Preload all the models
  var files = fs.readdirSync(process.cwd() + '/build/app/models/')
  var models = {}

  files.forEach(file => {
    if (file.match(/\.js$/) && file !== 'index.js') {
      var name = file.replace(/\.js/g, '').capitalize().singularize()
      console.log(file)
      models[name] = require(process.cwd() + '/build/app/models/' + file).default
    }
  })

  // Get a database connection
  var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development']
  var db = new DatabaseAdapter(dbConfig)

  // Run the console
  var replServer = repl.start()
  replServer.context.BaseModel = BaseModel
  for (var model in models) {
    replServer.context[model] = models[model]
  }
  replServer.context.db = db.client()
  replServer.context.runQuery = db.runQuery
}
