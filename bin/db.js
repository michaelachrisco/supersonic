var pg = require('pg');
var fs = require('fs');

exports.migrate = function(args) {
  // Load all migrations
  // Check the database for a migrations table
  // Read all the migrations
  // Run the missing migrations and add to the database

  var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development']
  var conString = `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`;
  var client = new pg.Client(conString);

  client.connect(function(err) {
    var migrations

    if (err) {
      return console.error('Could not connect to Postgres', err);
    }

    client.query("SELECT migration_name FROM schema_migrations", function(err, result) {
      if (err) {
        client.query("CREATE TABLE schema_migrations ( id integer NOT NULL, migration_name character varying(255) );", function(err, result) {
          if (err) {
            return console.error(err);
          }
        })
      } else {
        var migrationsToPerform = []
        migrations = result.rows.map(row => row.migration_name)
        var files = fs.readdirSync(`${process.cwd()}/db/migrate/`)
        console.log(files)
        files.forEach(file => {
          console.log(migrations)
          if (!migrations.include(file.replace(/\.js/, ''))) migrationsToPerform.push(file)
        })

        migrationsToPerform.forEach(migration => {
          var mig = require(`${process.cwd()}/db/migrate/${migration}`).default
          var queryString = (new mig()).change()
          client.query(queryString, function(err, result) {
            if (err) {
              return console.error(err);
            }
          })
        })

        client.end()
      }
    })


  })


  //client.connect(function(err) {
  //  if (err) {
  //    return console.error('Could not connect to Postgres', err)
  //  }

  //})
}

exports.setup = function(args) {
  var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development']
  var conString = `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}`;
  var client = new pg.Client(conString);

  client.connect(function(err) {
    if (err) {
      return console.error('Could not connect to Postgres', err);
    }

    client.query(`CREATE DATABASE "${dbConfig.database.underscore()}" with OWNER = ${dbConfig.user}`, function(err, result) {
      if (err) {
        console.error(err)
      }

      console.info(`Database ${dbConfig.database} created`)
      client.end()
    })
  })
}
