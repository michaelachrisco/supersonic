import React from 'react'
import { render } from 'react-dom'
import { injectPreparedData } from 'isomorphic-relay'
import { Router } from 'isomorphic-relay-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import '../app/assets/stylesheets/app'
import routes from '../config/routes'
import Relay from 'react-relay'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:7000/queries')
)

const data = JSON.parse(document.getElementById('preloadedData').textContent)

injectPreparedData(data)

render(
  <Router
    routes={routes}
    history={createBrowserHistory()}
  />,
  document.getElementById('app')
)
