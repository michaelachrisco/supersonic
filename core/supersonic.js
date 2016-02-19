import BaseReducer from './reducers/base_reducer'
import Router from './routing/router'
import relayContainer from './helpers/relay_decorator'
import reduxConnector from './helpers/redux_decorator'

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
  BaseReducer,
  relayContainer,
  reduxConnector
}
