import convert from 'koa-convert'
import database from './database'

export default app => {
  app.use(database)
}
