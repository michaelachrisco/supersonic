import 'regenerator/runtime'
import Koa from 'koa'
import Middleware from './middleware'
import Router from './router'
import cookie from 'react-cookie'

const app = new Koa()

// Custom middleware
//
// While you can add middleware in this file, it is recommended that you add
// your middleware to the 'middleware' directory to keep it organized and
// cleaner. This will also ensure that the Router middleware below gets run
// last.
Middleware(app)

// Router
app.use(async (ctx, next) => {
  await cookie.plugToRequest(ctx.request, ctx.response)
  await Router(ctx, next)
  next()
})

// Listen!
app.listen(process.env.PORT || 3000)
