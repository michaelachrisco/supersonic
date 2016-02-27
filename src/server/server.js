// Babel polyfill for async await
import 'babel-polyfill'

// Relay for injecting a network layer
import Relay from 'react-relay'

// Koa and other stuff
import Koa from 'koa'
import cookie from 'react-cookie'

// Grab the app middleware and default network layer
import { Router, ApplicationMiddleware, NetworkLayer } from 'supersonic'

// Custom middleware and the router
import Middleware from './middleware'

const app = new Koa()

// Inject the network layer into Relay. This should be the
// same network layer that you will be injecting into the
// client entry point.
Relay.injectNetworkLayer(new NetworkLayer())

// App setup middleware
//
// This is where Supersonic sets up all of it's internals. You shouldn't
// have to mess with this.
ApplicationMiddleware(app)

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
