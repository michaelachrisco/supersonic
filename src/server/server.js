import Koa from 'koa'
import Middleware from './middleware'
import Router from './router'
const app = new Koa()

Middleware(app)
app.use(Router)
app.listen(3000)
