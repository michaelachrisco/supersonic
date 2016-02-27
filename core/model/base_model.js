import 'legit-inflectors'
import squel from 'squel'

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

    return BaseModel.transaction(query)
  };

  static relation(name) {
    return new Relation(eval(name))
  }

  static first() {
    return BaseModel.relation(this.name).first()
  }

  static find(id) {
    return BaseModel.relation(this.name).find(id)
  };

  static where(params) {
    return BaseModel.relation(this.name).where(params)
  };

  static transaction(query) {
    var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development']
    var adapter = new DatabaseAdapter(dbConfig)
    return adapter.runQuery(query)
  }

  static setColumnNames() {
    BaseModel.transaction(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='${this.name.underscore().pluralize}'
    `).then(rows => eval(this.name).columnNames = rows.map(row => row.column_name))
  }

  static
  constructor(attributes) {
    for (let key in attributes) {
      this[key] = attributes[key]
    }
  }
}
