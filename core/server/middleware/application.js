import convert from 'koa-convert'
import mount from 'koa-mount'
import graphqlHTTP from 'koa-graphql'

import database from './database'

var schema = require(process.cwd() + '/build/config/schema.js').default

export default app => {
  app.use(convert(mount('/graphql', graphqlHTTP({ schema }))))
  app.use(database)
}
