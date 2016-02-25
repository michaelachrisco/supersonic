import Relay from 'react-relay'
import fetch from 'isomorphic-fetch'

export default class NetworkLayer {
  constructor(url = '/queries') {
    this.url = url
  }

  get defaultHeaders() {
    return {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    }
  }

  buildRequest(request) {
    return JSON.stringify({
      query: request.getQueryString(),
      variables: request.getVariables()
    })
  }

  sendMutation(request) {
    return fetch(this.url, {
      method: 'POST',
      body: this.buildRequest(request),
      headers: this.defaultHeaders
    }).
    then(response => response.json()).
    then(results => {
      if (results.errors) {
        request.reject(new Error(this.formatRequestErrors(results.errors, request)))
      } else {
        request.resolve({ response: results.data })
      }
    })
  }

  sendQueries(requests) {
    return Promise.all(requests.map(
      request => fetch(this.url, {
        method: 'POST',
        body: this.buildRequest(request),
        headers: this.defaultHeaders
      }).
      then(response => response.json()).
      then(results => {
        if (results.errors) {
          request.reject(new Error(this.formatRequestErrors(results.errors, request)))
        } else {
          request.resolve({ response: results.data })
        }
      })
    ))
  }

  supports(options) {
    return false
  }

  formatRequestErrors(errors, request) {
    let CONTEXT_BEFORE = 20,
        CONTEXT_LENGTH = 60,
        queryLines = request.getQueryString().split('\n')

    return errors.map(({locations, message}, ii) => {
      var prefix = (ii + 1) + '. '
      var indent = ' '.repeat(prefix.length)

      //custom errors thrown in graphql-server may not have locations
      var locationMessage = locations ?
        ('\n' + locations.map(({column, line}) => {
          var queryLine = queryLines[line - 1]
          var offset = Math.min(column - 1, CONTEXT_BEFORE)
          return [
            queryLine.substr(column - 1 - offset, CONTEXT_LENGTH),
            ' '.repeat(offset) + '^^^',
          ].map(messageLine => indent + messageLine).join('\n')
        }).join('\n')) :
        ''

      return prefix + message + locationMessage

    }).join('\n')
  }
}
