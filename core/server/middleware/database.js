import pg from 'pg-then'
import fs from 'fs'
import DatabaseAdapter from '../../model/database_adapter'
import SQL from 'sql-template-strings'


export default async (ctx, next) => {
  var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development']
  var adapter = new DatabaseAdapter(dbConfig)
  ctx.pg = ctx.pg || {}
  ctx.pg.sqlTemplate = (sqlString, name = 'query') => {
    return Object.assign(SQL`${sqlString}`, { name: name })
  }

  var { client, done } = await adapter.pool()

  ctx.pg.connection = { client, done }

  await next()

  ctx.pg.connection.done()
  delete ctx.pg.connection
}
