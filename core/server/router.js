import React from 'react'
import ReactDOMServer from 'react-dom/server'
import IsomorphicRouter from 'isomorphic-relay-router'
import { match } from 'react-router'
import IsomorphicRelay from 'isomorphic-relay'
import NetworkLayer from './network_layer'

const routes = require(`${process.cwd()}/build/config/routes`).default

export default (ctx, next) => {
  return new Promise((resolve, reject) => {
    match({ routes, location: ctx.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        ctx.status = 500
        ctx.body = error.message
        resolve()
      }
      else if (renderProps) {
        IsomorphicRouter.prepareData(renderProps).then(render).catch(ex => {
          let env = process.env.NODE_ENV
          if (env && env === 'production') {
            ctx.response.status = 500
            ctx.body = 'Uh oh, errors'
          } else if (env != 'test') {
            console.log(ex)
            ctx.res.writeHead(200, { 'Content-Type': 'text/html' })
            ctx.res.end(renderDevError(ex))
          }
          resolve()
        })
      } else {
        ctx.status = 404
        ctx.body = 'Not Found'
        resolve()
      }

      function render({ data, props }) {
        const html = ReactDOMServer.renderToString(<IsomorphicRouter.RouterContext {...props} />),
              renderedPage = renderPage({ content: html, title: 'SS Demo', preloadedData: data })

        ctx.status = 200
        ctx.body = renderedPage
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
        <link href="http://localhost:8080/js/styles.css" rel="stylesheet" />
        <title>${props.title}</title>
      </head>
      <body>
        <div id="app">${props.content}</div>
        <script id="preloadedData" type="application/json">${JSON.stringify(props.preloadedData)}</script>
        <script src="http://localhost:8080/js/app.js"></script>
      </body>
    </html>
  `
}

function renderDevError(props) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>FermentAble</title>
      </head>
      <body>
        <div id="app">
          <h1>${props.name}: ${props.message}</h1>
          <p>In: ${props.fileName} at line ${props.lineNumber}</p>
          <p>Stack: ${props.stack}</p>
        </div>
      </body>
    </html>
  `
}
