import '../ext/object'

const controllers = require('require-all')({
  dirname  : `${process.cwd()}/build/app/controllers`,
  filter   : /(.+_controller)\.js$/,
  recursive: true
})

const queries = require('require-all')({
  dirname  : `${process.cwd()}/build/app/queries`,
  filter   : /(.+_query)\.js$/,
  recursive: true
})

export default class Router {
  constructor() {
    console.log("FUCK IT")
    this._routes = { childRoutes: [] }
  }

  root(path, component) {
    this._routes.path = path
    this._routes.component = component
  }

  route(path, component, callback) {
    if (callback && callback.is_a('Function')) {
      let router = new Router()

      router.root(path, component)
      callback(router)

      this._routes.childRoutes.push(router._routes)
    } else {
      let onEnter = (nextState, replaceState) => {
        let controllerName = controllers[`${path}_controller`],
            controller

        if (controllerName) {
          controller = eval(`new ${controllerName}.default(nextState, replaceState)`)
        } else {
          controller = new controllers.base_controller.default(nextState, replaceState)
        }

        controller.call()
      }

      let queries,
          queryName = queries[`${path}_query`]

      if (queryName) queries = queryName.default

      this._routes.childRoutes.push({ path, component, onEnter, queries })
    }
  }
}
