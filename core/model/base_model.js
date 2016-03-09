import squel from 'squel'
import fs from 'fs'
import * as g from 'graphql'
import * as r from 'graphql-relay'

import Relation from './relation'
import DatabaseAdapter from './database_adapter'

export default class BaseModel {
  static create(params) {
    let pg = squel.useFlavour('postgres')
    let tableName = this.name.underscore().pluralize

    let query = pg.
      insert().
      into(tableName).
      setFields(params).
      returning('*').
      toParam()

    return BaseModel.transaction(query).then(rows => rows[0])
  };

  static count() {
    let pg = squel.useFlavour('postgres')
    let tableName = this.name.underscore().pluralize

    let query = pg.
      select().
      from(tableName).
      fields(['COUNT(*)']).
      toParam()

    return BaseModel.transaction(query).then(rows => rows[0].count)
  }

  static relation(name) {
    return new Relation(eval(name))
  }

  static all() {
    return BaseModel.relation(this).all()
  }

  static limit(count) {
    return BaseModel.relation(this).limit(count)
  }

  static first() {
    return BaseModel.relation(this).first()
  }

  static find(id) {
    return BaseModel.relation(this).find(id)
  };

  static where(params) {
    return BaseModel.relation(this).where(params)
  };

  static transaction(query) {
    var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development']
    var adapter = new DatabaseAdapter(dbConfig)
    return adapter.runQuery(query)
  }

  static getGraphQLType(type) {
    switch(true) {
      case /datetime/.test(type):
        return 'g.GraphQLString'
      case /string/.test(type):
        return 'g.GraphQLString'
      case /integer/.test(type):
        return 'g.GraphQLInt'
      case /float/.test(type):
        return 'g.GraphQLFloat'
      case /boolean/.test(type):
        return 'g.GraphQLBoolean'
      case /id/.test(type):
        return 'g.GraphQLID'
      default:
        return 'g.GraphQLString'
    }
  }

  static buildGraphQLType(columns, name) {
    var structure = {
      name: name.singularize().capitalize(),
      fields: {
        id: { type: `r.globalIdField('${name.singularize().capitalize()}')` },
        created_at: { type: 'g.GraphQLString' },
        updated_at: { type: 'g.GraphQLString' }
      }
    }

    columns.forEach(column => {
      var name = column.split(":")[0]
      var type = column.split(":")[1]
      structure.fields[name] = { type: BaseModel.getGraphQLType(type) }
    })

    return structure
  }

  constructor(attributes) {
    for (let key in attributes) {
      this[key] = attributes[key]
    }
  }
}
