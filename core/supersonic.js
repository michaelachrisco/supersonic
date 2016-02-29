import reduxConnector from './helpers/redux_decorator'
import BaseMigration from './model/base_migration'
import BaseModel from './model/base_model'
import ApplicationMiddleware from './server/middleware/application'
import NetworkLayer from './server/network_layer'
import Router from './server/router'
import SchemaBuilder from './schema/schema_builder'

export class Supersonic {
  static Application = {}
  static root = process.cwd()
}

const router = Supersonic.Router
const application = Supersonic.Application

export {
  application,
  reduxConnector,
  BaseMigration,
  BaseModel,
  ApplicationMiddleware,
  NetworkLayer,
  Router,
  SchemaBuilder
}
