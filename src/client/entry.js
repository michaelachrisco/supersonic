// React and Relay
import React from 'react'
import Relay from 'react-relay'
import { render } from 'react-dom'
import IsomorphicRelay from 'isomorphic-relay'
import IsomorphicRouter from 'isomorphic-relay-router'

// Browser History
import createBrowserHistory from 'history/lib/createBrowserHistory'

// Routes
import routes from '../config/routes'

// Stylesheets
import '../app/assets/stylesheets/app'

// Inject the default network layer
// You can create your own from scratch if you need custom
// behavior, or sub class the NetworkLayer class and
// override functionality.
Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer('/graphql'))

// Parse the preloaded data
const data = JSON.parse(document.getElementById('preloadedData').textContent)

// Inject the preloaded data for rendering
IsomorphicRelay.injectPreparedData(data)

// Render the app!
render(
  <IsomorphicRouter.Router
    routes={routes}
    history={createBrowserHistory()}
  />,
  document.getElementById('app')
)
