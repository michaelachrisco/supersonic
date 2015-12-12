import serve from 'koa-static'
import convert from 'koa-convert'
import logger from 'koa-logger'

export default app => {
  app.use(convert(serve('./build')))
  app.use(convert(logger()))
}
