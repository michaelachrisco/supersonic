import 'regenerator/runtime'
import Koa from 'koa'
import KoaStatic from 'koa-static'
import Middleware from './middleware'
import Router from './router'
const app = new Koa()

Middleware(app)
app.use(async (ctx, next) => {
  await Router(ctx, next)
  next()
})
app.listen(process.env.PORT || 3000)
