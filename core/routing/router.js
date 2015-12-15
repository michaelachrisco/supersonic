import '../ext/object'

export default class Router {
  constructor() {
    this._routes = { childRoutes: [] }
  }

  root(path, component) {
    this._routes.path = path
    this._routes.component = component
  }

  route(path, component, controller = {}, queries = {}, callback) {
    if (callback && callback.is_a('Function')) {
      let router = new Router()

      router.root(path, component)
      callback(router)

      this._routes.childRoutes.push(router._routes)
    } else {
      let onEnter = (nextState, replaceState) => {
        if (controller.is_a('Function')) {
          let cont = new controller(nextState, replaceState)
          cont.call()
        }
      }

      this._routes.childRoutes.push({ path, component, onEnter, queries })
    }
  }
}
