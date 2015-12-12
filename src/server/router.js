import { Supersonic } from 'supersonic'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RoutingContext } from 'react-router'

let routes = require(`${Supersonic.root}/build/config/routes`).default

export default (ctx, next) => {
  match({ routes, location: ctx.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      ctx.response.status = 500
      ctx.body = error.message
    }
    else if (renderProps) {
      let html = renderToString(<RoutingContext {...renderProps} />)
      ctx.response.status = 200
      ctx.body = renderPage({ content: html, title: 'Supersonic Demo' })
    } else {
      ctx.response.status = 404
      ctx.body = 'Not Found'
    }
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
        <script src="http://localhost:8080/js/app.js"></script>
      </body>
    </html>
  `
}
