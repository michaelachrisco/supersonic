import Router from './routing/router'
import relayContainer from './helpers/relay_decorator'
import reduxConnector from './helpers/redux_decorator'
import BaseMigration from './model/base_migration'
import BaseModel from './model/base_model'

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
  relayContainer,
  reduxConnector,
  BaseMigration,
  BaseModel
}
