import BaseReducer from './reducers/base_reducer'
import Router from './routing/router'

export class Supersonic {
  static Application = {}
  static Router = new Router()
  static root = process.cwd()
}

const router = Supersonic.Router
const application = Supersonic.Application

export {
  router,
  application,
  BaseReducer
}
