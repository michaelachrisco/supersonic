// Babel polyfill for async await
import 'babel-polyfill'
import 'legit-inflectors'

// Relay for injecting a network layer
import Relay from 'react-relay'

// Koa and other stuff
import Koa from 'koa'
import cookie from 'react-cookie'
import graphqlHTTP from 'koa-graphql'
import mount from 'koa-mount'
import convert from 'koa-convert'
import router from 'koa-router'
import bodyParser from 'koa-body-parser'

// Grab the app middleware and default network layer
import {
  Router,
  SchemaBuilder,
  ApplicationMiddleware
} from 'supersonic'

// Custom middleware and the router
import Middleware from './middleware'
import { Schema } from '~/config/schema'

// Create the app
const app = new Koa()

// Inject the network layer into Relay. This should be the
// same network layer that you will be injecting into the
// client entry point.
Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer('/graphql'))

// App setup middleware
//
// This is where Supersonic sets up all of it's internals. You shouldn't
// have to mess with this.
ApplicationMiddleware(app)

// Mount the graphql endpoint
//
app.use(convert(mount('/graphql', graphqlHTTP((req, ctx) => {
  return { schema: Schema, graphiql: (process.env.NODE_ENV === 'development') }
}))))

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
