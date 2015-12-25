import { Supersonic } from 'supersonic'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { prepareData, RoutingContext } from 'isomorphic-relay-router'
import { match } from 'react-router'
import IsomorphicRelay from 'isomorphic-relay'
import Relay from 'react-relay'
import RelayStoreData from 'react-relay/lib/RelayStoreData'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:7000/queries')
)

RelayStoreData.getDefaultInstance().getChangeEmitter().injectBatchingStrategy(() => {})

const routes = require(`${Supersonic.root}/build/config/routes`).default

export default (ctx, next) => {
  return new Promise((resolve, reject) => {
    match({ routes, location: ctx.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        ctx.response.status = 500
        ctx.body = error.message
        resolve()
      }
      else if (renderProps) {
        prepareData(renderProps).then(render)
      } else {
        ctx.response.status = 404
        ctx.body = 'Not Found'
        resolve()
      }

      function render(data) {
        const html = renderToString(<RoutingContext {...renderProps} />)
        ctx.res.writeHead(200, {'Content-Type': 'text/html'});
        ctx.res.end(renderPage({ content: html, title: 'Supersonic Demo', preloadedData: data }))
        resolve()
      }
    })
  })
}

function renderPage(props) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <link href="http://localhost:8888/js/styles.css" rel="stylesheet" />
        <title>${props.title}</title>
      </head>
      <body>
        <div id="app">${props.content}</div>
        <script id="preloadedData" type="application/json">${JSON.stringify(props.preloadedData)}</script>
        <script src="http://localhost:8888/js/app.js"></script>
      </body>
    </html>
  `
}
