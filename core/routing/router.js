import '../ext/object'

export default class Router {
  constructor() {
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
      this._routes.childRoutes.push({ path, component })
    }
  }
}
