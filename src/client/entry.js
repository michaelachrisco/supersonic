import React from 'react'
import { render } from 'react-dom'
import { Router } from 'isomorphic-relay-router'
import { match } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import '../app/assets/stylesheets/app'
import routes from '../config/routes'

const { pathname, search, hash } = window.location
const location = `${pathname}${search}${hash}`

match({ routes, location }, () => {
  render(
    <Router
      routes={routes}
      history={createBrowserHistory()}
    />,
    document.getElementById('app')
  )
})
