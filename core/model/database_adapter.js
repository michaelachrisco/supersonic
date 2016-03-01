import pg from 'pg-then'
import fs from 'fs'
import { heredoc } from '../utils/strings'
import chalk from 'chalk'

export default class DatabaseAdapter {
  constructor(connParams) {
    this.connParams = connParams
    this.connString = `postgres://${connParams.user}:${connParams.password}@${connParams.host}:${connParams.port}/${connParams.database}`
  }

  client(connString = this.connString) {
    return pg.Client(connString)
  }

  pool() {
    return pg.Pool(this.connString).connect()
  }

  runQuery(query, connString = this.connString) {
    var client = this.client(connString)

    return client.query(query).
    then(res => {
      client.end()
      return res.rows
    }).
    catch(ex => {
      client.end()
      console.error(ex.message)
    })
  }

  createDatabase(name, skipExtensions = false) {
    var connParams = this.connParams
    var connString = `postgres://${connParams.user}:${connParams.password}@${connParams.host}:${connParams.port}`
    var query = `CREATE DATABASE "${name.underscore()}";`

    return this.runQuery(query, connString).
    then(rows => {
      console.info(`Database ${name} created`)
      if (!skipExtensions) {
        this.enableUUIDExtension()
      }
    })
  }

  resetDatabase(name) {
    var connParams = this.connParams
    var connString = `postgres://${connParams.user}:${connParams.password}@${connParams.host}:${connParams.port}`
    var query = `DROP DATABASE "${name.underscore()}";`

    return this.runQuery(query, connString).
    then(rows => {
      console.info(`Database ${name} dropped`)
      this.createDatabase(name, true).then(res => {
        this.enableUUIDExtension().then(res => {
          this.performMigrations()
        })
      })
    })
  }

  enableUUIDExtension() {
    var query = `CREATE EXTENSION IF NOT EXISTS pgcrypto;`

    return this.runQuery(query).
    then(rows => {
      console.info(`pgcrypto extension created`)
    })
  }

  createMigrationSchema() {
    var query = heredoc`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        migration_name character varying(255),
        created_at timestamp DEFAULT current_timestamp
      )
    `
    return this.runQuery(query)
  }

  getPerformedMigrations() {
    var query = `SELECT migration_name FROM schema_migrations`

    return this.runQuery(query)
  }

  performMigration(migration) {
    var mig = require(`${process.cwd()}/db/migrate/${migration}`).default
    var queryString = (new mig()).change()

    return this.runQuery(queryString).
    then(rows => {
      var lineLength = queryString.split("\n").reduce((a, b) => a.length > b.length ? a : b).length
      var lineString = Array(lineLength + 3).join("=")

      console.info(heredoc`
        ${chalk.green('Performing migration for: ' + this.connParams.database)}
        ${chalk.blue(migration)}
        ${lineString}
        ${chalk.yellow(queryString)}
        ${lineString}

      `)
      this.createMigrationRecord(migration.replace(/\.js/, ''))
    })
  }

  createMigrationRecord(name) {
    var query = `INSERT INTO schema_migrations (migration_name) VALUES('${name}');`

    return this.runQuery(query)
  }

  performMigrations() {
    var files = fs.readdirSync(`${process.cwd()}/db/migrate/`)

    this.createMigrationSchema().
    then(res => {
      this.getPerformedMigrations()
      .then(rows => {
        var completedMigrations = rows.map(row => row.migration_name)
        var migrationsToPerform = []

        files.forEach(file => {
          if (file.match(/\.js$/)) {
            if (!completedMigrations.include(file.replace(/\.js/, ''))) migrationsToPerform.push(file)
          }
        })

        migrationsToPerform.forEach(migration => this.performMigration(migration))
      })
    })
  }
}
